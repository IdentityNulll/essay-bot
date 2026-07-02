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
    en: `🔔 <b>Big update dropping in 12 hours!</b>

We're about to launch a brand new feature in the <b>IELTS Essay Examiner</b> bot:

📝 <b>CEFR Letter Checking</b> — coming very soon!

Soon you'll be able to check your formal and informal <b>CEFR-level letters</b> and get detailed AI feedback on structure, tone, vocabulary, and grammar — just like with essays.

⏳ Stay tuned — it goes live in <b>12 hours!</b>

Make sure to come back and try it out 🚀`,

    // ─── UZBEK ─────────────────────────────────────────────────────────────────
    uz: `🔔 <b>12 soatdan so'ng katta yangilik!</b>

<b>IELTS Essay Examiner</b> botida yangi funksiya kelmoqda:

📝 <b>CEFR LETTER Tekshiruvi</b> — tez orada!

Yaqin orada rasmiy va norasmiy <b>CEFR darajasidagi maktublaringizni</b> tekshira olasiz va tuzilish, uslub, so'z boyligi va grammatika bo'yicha batafsil AI fikr-mulohaza olasiz — xuddi insholar kabi.

⏳ Kuzatib boring — <b>12 soatdan</b> keyin ishga tushadi!

Qaytib kelib sinab ko'ring 🚀`,

    // ─── RUSSIAN ───────────────────────────────────────────────────────────────
    ru: `🔔 <b>Большое обновление через 12 часов!</b>

В боте <b>IELTS Essay Examiner</b> скоро появится новая функция:

📝 <b>LETTER писем по CEFR</b> — совсем скоро!

Вы сможете проверять свои формальные и неформальные <b>письма уровня CEFR</b> и получать подробную обратную связь от ИИ по структуре, тону, лексике и грамматике — так же, как с эссе.

⏳ Следите за обновлениями — запуск через <b>12 часов!</b>

Возвращайтесь и попробуйте 🚀`,
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

    console.log(`📢 Found ${users.length} users. Starting teaser broadcast...\n`);

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
    const summaryMessage = `📊 <b>[TEASER BROADCAST COMPLETE]</b>

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
