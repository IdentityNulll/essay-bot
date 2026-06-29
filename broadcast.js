import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import { Telegram } from 'telegraf';
import { connectDB } from './config/db.js';
import User from './models/User.js';

dotenv.config();

// Helper to add a delay between messages to respect Telegram rate limits
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Path to the broadcast image
const IMAGE_PATH = './assets/progress-feature.png';

// Contact group URL
const CONTACT_URL = 'https://t.me/+BMjBYcW4_oNjNjNi';

// Inline contact button per language
const CONTACT_BUTTONS = {
  en: { text: '💬 Contact Support', url: CONTACT_URL },
  uz: { text: '💬 Yordam olish', url: CONTACT_URL },
  ru: { text: '💬 Написать нам', url: CONTACT_URL },
};

/**
 * Returns the broadcast message text based on language and credit count.
 * @param {'en'|'uz'|'ru'} lang
 * @param {number} credits
 */
function getMessage(lang, credits) {
  const messages = {
    // ─── ENGLISH ─────────────────────────────────────────────────────────────
    en: {
      two: `📢 <b>Exciting Update: AI Progress Tracking is here!</b> 📊

We just launched a brand new feature in the <b>IELTS Essay Examiner</b> bot: <b>AI Progress Tracking</b>!

After submitting at least <b>2 essays</b>, our AI will compare your writing history and deliver a detailed personalized report — band score trends, strengths, weaknesses, and an action plan.

🎉 <b>Good news:</b> You currently have <b>2 essay credits</b> ready to go! Use them to check your essays and then unlock your personalized Progress Report.

Tap "📊 Progress" in the menu or type /progress after your 2nd essay to see your analysis!

Need help? Tap the button below 👇`,

      one: `📢 <b>Exciting Update: AI Progress Tracking is here!</b> 📊

We just launched a brand new feature: <b>AI Progress Tracking</b> — our AI analyzes your past essays and gives you a full personalized report on your improvement!

✍️ <b>You have 1 essay credit left.</b> Go ahead and use it — every essay you check gets you closer to unlocking your Progress Report (available after 2 essays).

Tap "📝 Check Essay" or type /check to use your credit now!

Need help? Tap the button below 👇`,
    },

    // ─── UZBEK ───────────────────────────────────────────────────────────────
    uz: {
      two: `📢 <b>Ajoyib yangilik: AI Jarayon Tahlili ishga tushdi!</b> 📊

Biz <b>IELTS Essay Examiner</b> botida yangi funksiyani ishga tushirdik: <b>AI Jarayon Tahlili (Progress Tracking)</b>!

Kamida <b>2 ta insho</b> yuborganingizdan so'ng, AI sizning yozish tarixingizni tahlil qiladi va shaxsiy hisobot tayyorlaydi — ball tendensiyalari, kuchli va zaif tomonlar, va harakat rejasi.

🎉 <b>Xushxabar:</b> Hozir sizda <b>2 ta insho krediti</b> bor! Ulardan foydalanib insholaringizni tekshiring va shaxsiy Progress Hisobotingizni oching.

2-inshoni tekshirganingizdan so'ng menyudagi "📊 Progress" tugmasini bosing yoki /progress yuboring!

Yordam kerakmi? Quyidagi tugmani bosing 👇`,

      one: `📢 <b>Ajoyib yangilik: AI Jarayon Tahlili ishga tushdi!</b> 📊

Yangi funksiya taqdim etildi: <b>AI Jarayon Tahlili</b> — AI sizning oldingi insholaringizni tahlil qilib, rivojlanishingiz haqida batafsil shaxsiy hisobot beradi!

✍️ <b>Sizda 1 ta insho krediti qoldi.</b> Kreditingizdan foydalaning — har bir tekshirilgan insho sizni Progress Hisobotiga (2 ta inshоdan so'ng) yaqinlashtiradi.

Hozir kreditingizdan foydalanish uchun "📝 Inshoni tekshirish" tugmasini bosing yoki /check yuboring!

Yordam kerakmi? Quyidagi tugmani bosing 👇`,
    },

    // ─── RUSSIAN ─────────────────────────────────────────────────────────────
    ru: {
      two: `📢 <b>Отличное обновление: Анализ прогресса от ИИ уже здесь!</b> 📊

Мы только что запустили новую функцию в боте <b>IELTS Essay Examiner</b>: <b>Анализ прогресса</b>!

После отправки минимум <b>2 эссе</b>, наш ИИ сравнит вашу историю написания и подготовит персональный отчёт — динамика баллов, сильные и слабые стороны, план действий.

🎉 <b>Хорошая новость:</b> Сейчас у вас есть <b>2 кредита</b> — готовы к использованию! Проверьте свои эссе и разблокируйте персональный Отчёт о прогрессе.

После 2-го эссе нажмите "📊 Прогресс" в меню или отправьте /progress!

Нужна помощь? Нажмите кнопку ниже 👇`,

      one: `📢 <b>Отличное обновление: Анализ прогресса от ИИ уже здесь!</b> 📊

Представляем новую функцию: <b>Анализ прогресса</b> — ИИ анализирует ваши прошлые эссе и предоставляет полный персональный отчёт о вашем улучшении!

✍️ <b>У вас остался 1 кредит.</b> Используйте его — каждое проверенное эссе приближает вас к Отчёту о прогрессе (доступен после 2 эссе).

Нажмите "📝 Проверить эссе" или отправьте /check, чтобы использовать кредит сейчас!

Нужна помощь? Нажмите кнопку ниже 👇`,
    },
  };

  const langMessages = messages[lang] || messages['en'];
  // Users with 2+ credits get the "two" message, users with 1 credit get "one"
  return credits >= 2 ? langMessages.two : langMessages.one;
}

async function sendPhoto(telegram, chatId, caption, lang) {
  const contactBtn = CONTACT_BUTTONS[lang] || CONTACT_BUTTONS['en'];
  return telegram.sendPhoto(
    chatId,
    { source: fs.createReadStream(IMAGE_PATH) },
    {
      caption,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: contactBtn.text, url: contactBtn.url }]
        ]
      }
    }
  );
}

async function run() {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('❌ Error: TELEGRAM_BOT_TOKEN is not defined in environment variables.');
    process.exit(1);
  }

  if (!process.env.ADMIN_CHAT_ID) {
    console.error('❌ Error: ADMIN_CHAT_ID is not defined in environment variables.');
    process.exit(1);
  }

  // Connect to the database
  console.log('Connecting to database...');
  await connectDB();

  const telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN);
  const adminChatId = process.env.ADMIN_CHAT_ID;

  try {
    // ─── STEP 1: Send preview to admin first ─────────────────────────────────
    console.log('\n📨 Sending previews to admin first...');

    // Show admin both message variants so they can review
    const previewTwo = `🔔 <b>[ADMIN PREVIEW — 2 credits variant]</b>\n\n` + getMessage('en', 2);
    const previewOne = `🔔 <b>[ADMIN PREVIEW — 1 credit variant]</b>\n\n` + getMessage('en', 1);

    try {
      await sendPhoto(telegram, adminChatId, previewTwo, 'en');
      await delay(500);
      await sendPhoto(telegram, adminChatId, previewOne, 'en');
      console.log(`✅ Admin previews sent to: ${adminChatId}`);
    } catch (err) {
      console.error(`❌ Failed to send admin preview: ${err.message}`);
      console.log('Aborting broadcast. Fix the issue and try again.');
      await mongoose.disconnect();
      return;
    }

    // ─── STEP 2: Wait before proceeding ──────────────────────────────────────
    console.log('\n⏳ Waiting 10 seconds before starting the full broadcast...');
    console.log('   (Kill this process now with Ctrl+C if the preview looks wrong)\n');
    await delay(10000);

    // ─── STEP 3: Fetch all users ──────────────────────────────────────────────
    console.log('Querying all users...');
    const users = await User.find();

    if (users.length === 0) {
      console.log('✨ No users found in database.');
      await mongoose.disconnect();
      return;
    }

    console.log(`📢 Found ${users.length} users. Starting broadcast campaign...\n`);

    let successCount = 0;
    let failureCount = 0;
    let twoCreditsCount = 0;
    let oneCreditsCount = 0;

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const lang = user.selectedLanguage || 'en';
      const credits = user.creditCount;
      const messageText = getMessage(lang, credits);

      const variant = credits >= 2 ? '2-credits' : '1-credit';
      console.log(`[${i + 1}/${users.length}] User: ${user.userId} (@${user.username || 'N/A'}) | Lang: ${lang} | Credits: ${credits} | Variant: ${variant}`);

      try {
        await sendPhoto(telegram, user.userId, messageText, lang);

        console.log(`   ✅ Message sent to user: ${user.userId}`);
        successCount++;
        if (credits >= 2) twoCreditsCount++; else oneCreditsCount++;
      } catch (err) {
        console.error(`   ❌ Failed for user ${user.userId}: ${err.message}`);
        failureCount++;
      }

      // 100ms delay to respect Telegram API rate limits
      await delay(100);
    }

    // ─── STEP 4: Send summary to admin ───────────────────────────────────────
    const summaryMessage = `📊 <b>[BROADCAST COMPLETE]</b>

✅ <b>Successfully notified:</b> ${successCount}
❌ <b>Failures:</b> ${failureCount}
📬 <b>Total users processed:</b> ${users.length}

📋 <b>Variants sent:</b>
• "2 credits" variant: ${twoCreditsCount}
• "1 credit" variant: ${oneCreditsCount}`;

    try {
      await telegram.sendMessage(adminChatId, summaryMessage, { parse_mode: 'HTML' });
      console.log('\n✅ Summary report sent to admin.');
    } catch (e) {
      console.error('Could not send summary to admin:', e.message);
    }

    console.log('\n=======================================');
    console.log('🎉 Broadcast Finished!');
    console.log(`✅ Sent: ${successCount} | ❌ Failed: ${failureCount}`);
    console.log(`📋 2-credit variant: ${twoCreditsCount} | 1-credit variant: ${oneCreditsCount}`);
    console.log('=======================================');

  } catch (error) {
    console.error('Fatal error occurred during broadcast execution:', error);
  } finally {
    console.log('Disconnecting from database...');
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

run();
