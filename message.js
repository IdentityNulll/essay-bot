import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Telegram } from 'telegraf';
import { connectDB } from './config/db.js';
import User from './models/User.js';

dotenv.config();

// Helper to add a delay between messages to respect Telegram rate limits
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Contact group URL
const CONTACT_URL = 'https://t.me/+BMjBYcW4_oNjNjNi';

/**
 * Returns the teaser message text based on language.
 * @param {'en'|'uz'|'ru'} lang
 */
function getMessage(lang) {
  const messages = {
    // ─── ENGLISH ───────────────────────────────────────────────────────────────
    en: `📩 <b>New Update: CEFR Letter Check is live!</b>

You can now check your <b>formal and informal CEFR letters</b> directly in the bot.

Send /letter or tap <b>📩 Letter Check</b> in the menu.

Our AI examiner will evaluate your letter by:
• Task Completion
• Coherence and Cohesion
• Lexical Resource
• Grammar Range and Accuracy

You will receive a full report with your estimated <b>CEFR level</b> from A1 to C2.

Your existing credits work for both <b>Essay Check</b> and <b>Letter Check</b>. Try it today 🚀`,

    // ─── UZBEK ─────────────────────────────────────────────────────────────────
    uz: `📩 <b>Yangi funksiya: CEFR Maktub tekshiruvi ishga tushdi!</b>

Endi bot orqali <b>rasmiy va norasmiy CEFR maktublaringizni</b> tekshirishingiz mumkin.

/letter yuboring yoki menyudan <b>📩 Maktubni tekshirish</b> tugmasini bosing.

AI examiner maktubingizni quyidagilar bo'yicha baholaydi:
• Vazifani bajarish
• Mantiqiy bog'lanish
• So'z boyligi
• Grammatika diapazoni va aniqligi

Siz A1 dan C2 gacha bo'lgan <b>CEFR darajangiz</b> bilan to'liq hisobot olasiz.

Mavjud kreditlaringiz <b>insho</b> va <b>maktub</b> tekshiruvi uchun ishlaydi. Bugun sinab ko'ring 🚀`,

    // ─── RUSSIAN ───────────────────────────────────────────────────────────────
    ru: `📩 <b>Новое обновление: проверка CEFR писем уже доступна!</b>

Теперь вы можете проверять <b>формальные и неформальные письма CEFR</b> прямо в боте.

Отправьте /letter или нажмите <b>📩 Проверить письмо</b> в меню.

AI examiner оценит письмо по критериям:
• Выполнение задания
• Связность и логика
• Лексический ресурс
• Грамматический диапазон и точность

Вы получите полный отчет с примерным <b>уровнем CEFR</b> от A1 до C2.

Ваши кредиты подходят и для <b>эссе</b>, и для <b>писем</b>. Попробуйте сегодня 🚀`,
  };

  return messages[lang] || messages['en'];
}

async function sendMessage(telegram, chatId, text, lang) {
  return telegram.sendMessage(chatId, text, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: lang === 'uz' ? '💬 Guruhimizga qo\'shiling' : lang === 'ru' ? '💬 Присоединиться к группе' : '💬 Join Our Community', url: CONTACT_URL }]
      ]
    }
  });
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

  console.log('Connecting to database...');
  await connectDB();

  const telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN);
  const adminChatId = process.env.ADMIN_CHAT_ID;

  try {
    // ─── STEP 1: Send preview to admin first ───────────────────────────────────
    console.log('\n📨 Sending preview to admin first...');

    const adminPreview = `🔔 <b>[ADMIN PREVIEW — EN variant]</b>\n\n` + getMessage('en');

    try {
      await sendMessage(telegram, adminChatId, adminPreview, 'en');
      console.log(`✅ Admin preview sent to: ${adminChatId}`);
    } catch (err) {
      console.error(`❌ Failed to send admin preview: ${err.message}`);
      console.log('Aborting broadcast. Fix the issue and try again.');
      await mongoose.disconnect();
      return;
    }

    // ─── STEP 2: Wait for admin to review ─────────────────────────────────────
    console.log('\n⏳ Waiting 10 seconds before starting the full broadcast...');
    console.log('   (Kill this process now with Ctrl+C if the preview looks wrong)\n');
    await delay(10000);

    // ─── STEP 3: Fetch all users ───────────────────────────────────────────────
    console.log('Querying all users...');
    const users = await User.find();

    if (users.length === 0) {
      console.log('✨ No users found in database.');
      await mongoose.disconnect();
      return;
    }

    console.log(`📢 Found ${users.length} users. Starting letter update broadcast...\n`);

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const lang = user.selectedLanguage || 'en';
      const messageText = getMessage(lang);

      console.log(`[${i + 1}/${users.length}] User: ${user.userId} (@${user.username || 'N/A'}) | Lang: ${lang}`);

      try {
        await sendMessage(telegram, user.userId, messageText, lang);
        console.log(`   ✅ Sent to user: ${user.userId}`);
        successCount++;
      } catch (err) {
        console.error(`   ❌ Failed for user ${user.userId}: ${err.message}`);
        failureCount++;
      }

      // 100ms delay to respect Telegram API rate limits
      await delay(100);
    }

    // ─── STEP 4: Send summary to admin ────────────────────────────────────────
    const summaryMessage = `📊 <b>[LETTER UPDATE BROADCAST COMPLETE]</b>

✅ <b>Successfully sent:</b> ${successCount}
❌ <b>Failures:</b> ${failureCount}
📬 <b>Total users processed:</b> ${users.length}`;

    try {
      await telegram.sendMessage(adminChatId, summaryMessage, { parse_mode: 'HTML' });
      console.log('\n✅ Summary report sent to admin.');
    } catch (e) {
      console.error('Could not send summary to admin:', e.message);
    }

    console.log('\n=======================================');
    console.log('🎉 Teaser Broadcast Finished!');
    console.log(`✅ Sent: ${successCount} | ❌ Failed: ${failureCount}`);
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
