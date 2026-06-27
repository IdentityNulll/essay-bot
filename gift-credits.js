import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Telegram } from 'telegraf';
import { connectDB } from './config/db.js';
import User from './models/User.js';

dotenv.config();

// Helper to add a delay between messages to respect Telegram rate limits
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Professional message translations for all supported languages
const MESSAGES = {
  en: `<b>Dear User,</b>

Thank you for choosing the <b>IELTS Essay Examiner</b> bot. We hope it has been a valuable resource in your exam preparation journey!

To show our appreciation, and because we would highly value your <b>honest feedback</b> to help us improve, we have credited <b>1 additional credit</b> to your account. 

Feel free to test the bot further and share your suggestions with us. You can send your feedback to our team via the /contact command.

Type /check or use the menu below to examine your next essay!`,

  uz: `<b>Hurmatli foydalanuvchi,</b>

<b>IELTS Essay Examiner</b> botini tanlaganingiz uchun sizga samimiy minnatdorchilik bildiramiz. Umid qilamizki, bu sizning imtihonga tayyorgarlik ko'rish yo'lingizda foydali vosita bo'lmoqda!

Sizga o'z minnatdorchiligimizni ko'rsatish maqsadida hamda botimizni yanada yaxshilash uchun sizning <b>xolis fikr-mulohazangiz</b> biz uchun juda mukim bo'lganligi sababli, hisobingizga <b>yana 1 ta bepul kredit</b> qo'shib berdik.

Botimizdan foydalanishda davom eting va o'z takliflaringizni biz bilan o'rtoqlashing. Fikr-mulohazalaringizni /contact buyrug'i orqali jamoamizga yuborishingiz mumkin.

Keyingi inshongizni tekshirish uchun /check yozing yoki quyidagi menyudan foydalaning!`,

  ru: `<b>Уважаемый пользователь,</b>

Благодарим вас за выбор бота <b>IELTS Essay Examiner</b>. Надеемся, что он является полезным инструментом при подготовке к экзамену!

В знак нашей признательности, а также потому, что для улучшения работы бота нам очень важно услышать ваш <b>честный отзыв</b>, мы зачислили на ваш баланс <b>1 дополнительный кредит</b>.

Будем рады, если вы продолжите использовать бот и поделитесь своими замечаниями. Вы можете отправить свой отзыв нашей команде поддержки с помощью команды /contact.

Отправьте команду /check или используйте меню ниже, чтобы проверить ваше следующее эссе!`
};

async function run() {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('❌ Error: TELEGRAM_BOT_TOKEN is not defined in environment variables.');
    process.exit(1);
  }

  // Connect to the database
  console.log('Connecting to database...');
  await connectDB();

  const telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN);

  try {
    // Find all users with exactly 0 credits
    console.log('Querying users with 0 credits...');
    const users = await User.find({ creditCount: 0 });

    if (users.length === 0) {
      console.log('✨ No users found with 0 credits.');
      await mongoose.disconnect();
      return;
    }

    console.log(`📢 Found ${users.length} users with 0 credits. Starting credit grant and announcement campaign...\n`);

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const lang = user.selectedLanguage || 'en';
      const messageText = MESSAGES[lang] || MESSAGES['en'];

      console.log(`[${i + 1}/${users.length}] Processing user ID: ${user.userId} (@${user.username || 'No Username'}) [Language: ${lang}]`);

      // Grant 1 credit
      user.creditCount = 1;

      try {
        // Send the announcement message first
        await telegram.sendMessage(user.userId, messageText, { parse_mode: 'HTML' });

        // Save DB changes only if message was sent successfully (prevents giving credits to blocked/inactive users)
        await user.save();

        console.log(`   ✅ Credit granted and message sent to user: ${user.userId}`);
        successCount++;
      } catch (err) {
        console.error(`   ❌ Failed to process user ${user.userId}: ${err.message}`);
        failureCount++;
      }

      // Add a 100ms delay between sending messages to respect Telegram API rate limits (max 30 messages/sec)
      await delay(100);
    }

    console.log('\n=======================================');
    console.log('🎉 Campaign Finished!');
    console.log(`✅ Success (Credits granted & notified): ${successCount}`);
    console.log(`❌ Failures (Could not notify/update): ${failureCount}`);
    console.log('=======================================');

  } catch (error) {
    console.error('Fatal error occurred during campaign execution:', error);
  } finally {
    // Gracefully disconnect from database
    console.log('Disconnecting from database...');
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

run();
