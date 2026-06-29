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

const MESSAGES = {
  en: `📢 <b>Exciting Update: AI Progress Tracking is here!</b> 📊

We are thrilled to announce a brand new feature in the <b>IELTS Essay Examiner</b> bot: <b>AI Progress Tracking</b>!

After you submit at least <b>2 essays</b>, our AI can analyze your writing history to provide a detailed progress report, comparing your band scores and giving you tailored recommendations to improve.

To celebrate this release, we have set your essay credits to <b>2 credits</b>! 🎁 

Tap the "📊 Progress" button in the menu or type /progress to check it out! Go ahead and check your next essays to unlock your detailed progress tracking analysis.

Type /check or use the menu below to examine your next essay!`,

  uz: `📢 <b>Ajoyib yangilik: AI Jarayon Tahlili ishga tushdi!</b> 📊

Biz <b>IELTS Essay Examiner</b> botida yangi funksiya — <b>AI Jarayon Tahlilini (Progress Tracking)</b> e'lon qilishdan mamnunmiz!

Kamida <b>2 ta insho</b> yuborganingizdan so'ng, AI sizning yozish tarixingizni tahlil qila oladi, natijalaringizni taqqoslaydi va ballingizni oshirish uchun maxsus tavsiyalar beradi.

Ushbu yangilik munosabati bilan biz sizning insho kreditlaringizni <b>2 ta kreditga</b> o'rnatdik! 🎁

Menyudagi "📊 Progress" tugmasini bosing yoki /progress buyrug'ini yuboring. Keyingi insholaringizni tekshiring va shaxsiy tahlilingizni oching!

Keyingi inshongizni tekshirish uchun /check yozing yoki quyidagi menyudan foydalaning!`,

  ru: `📢 <b>Отличное обновление: Анализ прогресса от ИИ уже здесь!</b> 📊

Мы рады представить вам новую функцию в боте <b>IELTS Essay Examiner</b>: <b>Анализ прогресса</b>!

После того, как вы отправите как минимум <b>2 эссе</b>, наш ИИ сможет проанализировать всю историю ваших работ, сравнить ваши оценки и дать индивидуальные рекомендации для улучшения результатов.

В честь этого обновления мы установили баланс ваших кредитов на <b>2 кредита</b>! 🎁

Нажмите кнопку "📊 Прогресс" в меню или отправьте команду /progress, чтобы попробовать! Пишите новые эссе и получайте подробный отчет о своем прогрессе.

Отправьте команду /check или используйте меню ниже, чтобы проверить ваше следующее эссе!`
};

async function sendPhoto(telegram, chatId, caption) {
  return telegram.sendPhoto(chatId, { source: fs.createReadStream(IMAGE_PATH) }, {
    caption,
    parse_mode: 'HTML'
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

  // Connect to the database
  console.log('Connecting to database...');
  await connectDB();

  const telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN);
  const adminChatId = process.env.ADMIN_CHAT_ID;

  try {
    // ─── STEP 1: Send preview to admin first ─────────────────────────────────
    console.log('\n📨 Sending preview to admin first...');
    const adminPreviewCaption = `🔔 <b>[ADMIN PREVIEW]</b> This is how the broadcast will look to users:\n\n` + MESSAGES['en'];

    try {
      await sendPhoto(telegram, adminChatId, adminPreviewCaption);
      console.log(`✅ Admin preview sent to: ${adminChatId}`);
    } catch (err) {
      console.error(`❌ Failed to send admin preview: ${err.message}`);
      console.log('Aborting broadcast. Fix the issue and try again.');
      await mongoose.disconnect();
      return;
    }

    // ─── STEP 2: Ask for confirmation ────────────────────────────────────────
    // Give admin 10 seconds to see the preview before proceeding
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

    console.log(`📢 Found ${users.length} users. Starting credit update to 2 and broadcast campaign...\n`);

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const lang = user.selectedLanguage || 'en';
      const messageText = MESSAGES[lang] || MESSAGES['en'];

      console.log(`[${i + 1}/${users.length}] Processing user ID: ${user.userId} (@${user.username || 'No Username'}) [Language: ${lang}]`);

      // Set credits to exactly 2
      user.creditCount = 2;

      try {
        // Send the announcement photo with caption
        await sendPhoto(telegram, user.userId, messageText);

        // Save DB changes only if message was sent successfully
        await user.save();

        console.log(`   ✅ Credits set to 2 and photo sent to user: ${user.userId}`);
        successCount++;
      } catch (err) {
        console.error(`   ❌ Failed to process user ${user.userId}: ${err.message}`);
        failureCount++;
      }

      // 100ms delay to respect Telegram API rate limits (max 30 messages/sec)
      await delay(100);
    }

    // ─── STEP 4: Send summary to admin ───────────────────────────────────────
    const summaryMessage = `📊 <b>[BROADCAST COMPLETE]</b>\n\n✅ <b>Success (credits updated & photo sent):</b> ${successCount}\n❌ <b>Failures (could not notify/update):</b> ${failureCount}\n📬 <b>Total users processed:</b> ${users.length}`;

    try {
      await telegram.sendMessage(adminChatId, summaryMessage, { parse_mode: 'HTML' });
      console.log('\n✅ Summary report sent to admin.');
    } catch (e) {
      console.error('Could not send summary to admin:', e.message);
    }

    console.log('\n=======================================');
    console.log('🎉 Broadcast Finished!');
    console.log(`✅ Success (Credits updated & photo sent): ${successCount}`);
    console.log(`❌ Failures (Could not notify/update): ${failureCount}`);
    console.log('=======================================');

  } catch (error) {
    console.error('Fatal error occurred during broadcast execution:', error);
  } finally {
    // Gracefully disconnect from database
    console.log('Disconnecting from database...');
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

run();
