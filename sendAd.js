import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import fetch from "node-fetch";

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const BOT_USERNAME = process.env.BOT_USERNAME || "your_bot_username";

const IMAGE_PATH = "./image.png";

const adMessage = `✨ <b>Essayni AI bot bilan tekshiring!</b>

📝 IELTS imtihoniga tayyorlanayapsizmi?
Endi Essaylaringizni <b>haqiqiy IELTS mezonlari</b> asosida tekshirish mumkin — sekundlar ichida!

🎯 <b>Bot nima qiladi?</b>
• Band skoringizni aniq hisoblaydi
• 4 ta rasmiy mezon bo'yicha batafsil fikr beradi
• Grammatika va leksik xatolaringizni ko'rsatadi
• PDF yoki .docx fayl ham qabul qiladi

⚡️ <b>Qanday ishlaydi?</b>
1️⃣ Insho savolingizni yuboring
2️⃣ Inshongizni yuboring
3️⃣ 30 soniyada to'liq hisobot oling!

🆓 <b>Birinchi tekshirish — bepul!</b>
Hoziroq sinab ko'ring 👇`;

async function sendAdMessage() {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    console.error("❌ Missing BOT_TOKEN or ADMIN_CHAT_ID in .env");
    process.exit(1);
  }

  if (!fs.existsSync(IMAGE_PATH)) {
    console.error(`❌ Image not found at: ${IMAGE_PATH}`);
    console.error("👉 Save your ad image as 'ad_image.jpg' in the same folder.");
    process.exit(1);
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

  const replyMarkup = JSON.stringify({
    inline_keyboard: [
      [
        {
          text: "📝 Inshoni tekshirish →",
          url: `https://t.me/${BOT_USERNAME}`,
        },
      ],
    ],
  });

  const form = new FormData();
  form.append("chat_id", ADMIN_CHAT_ID);
  form.append("photo", fs.createReadStream(path.resolve(IMAGE_PATH)), {
    filename: "ad_image.jpg",
    contentType: "image/jpeg",
  });
  form.append("caption", adMessage);
  form.append("parse_mode", "HTML");
  form.append("reply_markup", replyMarkup);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ Could not parse Telegram response:");
      console.error(text);
      process.exit(1);
    }

    if (data.ok) {
      console.log("✅ Ad message with image sent successfully!");
      console.log(`📨 Message ID: ${data.result.message_id}`);
    } else {
      console.error("❌ Telegram API error:", data.description);
      console.error("Full response:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("❌ Request failed:", error.message);
    console.error("💡 Full error:", error);
  }
}

sendAdMessage();