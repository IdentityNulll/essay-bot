export const translations = {
  en: {
    languageSelected: "🇬🇧 English selected successfully!",
    welcome: `✨ <b>Welcome to IELTS & CEFR examiner</b> ✨

Your AI-powered Writing Assistant, powered by <b>Anthropic Claude</b>

Get instant, detailed feedback on your IELTS essays & CEFR letters with professional criteria-based scoring just like a real examiner.

📊 <b>Current Credits:</b> <code>{credits} checks</code>

🚀 <b>Get Started:</b>
1. Tap "📝 Essay Check", "📩 Letter Check" or send /check, /letter
2. Share your question (or skip if it's in your document)
3. Upload your essay or letter (text, PDF, or DOCX)
4. Receive detailed feedback in seconds!`,

    help: `📖 <b>How to Use AI Essay & Letter Examiner</b>

Follow these simple steps to get feedback on your writing:

1️⃣ <b>Start</b> — Send /check, /letter or tap the check buttons
2️⃣ <b>Question</b> — Copy your question topic or skip if it's in your document
3️⃣ <b>Writing</b> — Share your essay or letter (text, PDF, or DOCX file)
4️⃣ <b>Feedback</b> — Get instant professional analysis

<b>Quick Commands:</b>
/start — Restart bot
/help — View this guide
/commands — All commands
/check — Grade an essay
/letter — Grade a CEFR letter
/credits — Buy credits
/profile — View account`,

    commandsList: `💻 <b>Available Commands:</b>

/start — Restart / Change language
/check — Check an essay
/letter — Check a CEFR letter
/profile — View your account
/credits — Buy credits
/help — Full guide
/contact — Contact us`,

    contact: `📞 <b>Contact & Support</b>

Join our community group for help, support, and questions:

👥 <b>Community Group:</b> Click the button below to join`,

    profile: `👤 <b>Your Profile</b>

• <b>Username:</b> @{username}
• <b>User ID:</b> <code>{userId}</code>
• <b>Language:</b> 🇬🇧 English
• <b>Credits:</b> <code>{credits} checks remaining</code>`,

    btnCheck: "📝 Essay Check",
    btnLetterCheck: "📩 Letter Check",
    btnProfile: "👤 Profile",
    btnHelp: "📖 Help",
    btnContact: "💬 Contact",
    btnChangeLanguage: "🌐 Language",
    btnBuyCredits: "💳 Buy Credits",
    btnBonus: "🎁 Bonus",
    btnProgress: "📊 Progress",
    btnContactDirectly: "💬 Chat with Us",
    menuUpdated: "⬇️ You can use the menu buttons below:",
    progressNotEnoughEssays: `📊 <b>Progress Tracking</b>

To analyze your writing progress and give you detailed feedback, we need to compare at least <b>2 essays</b>.

Please submit more essays using the /check command or the menu below, then check your progress again! ✍️`,
    progressAnalyzing: `⏳ <b>Analyzing your writing history...</b>
Our AI is reviewing your past essays to generate a detailed progress report. Please wait.`,

    promptQuestion: `❓ <b>Phase 1: The Essay Question</b>

Please send the <b>Essay Question/Prompt</b>. 
You can:
• Copy-paste the question text.
• Send a photo of the question.
• Tap the button below if the question is already inside your essay file.`,

    btnSkipQuestion: "⏩ Skip if question is in PDF/Doc",
    questionSkipped: "✅ Question skipped. Proceeding to Phase 2.",

    promptEssay: `✍️ <b>Phase 2: The Essay</b>

Please send your <b>Essay</b> now. 
You can:
• Copy-paste your essay text directly.
• Upload a document file (<code>.pdf</code> or <code>.docx</code>).`,

    promptLetterQuestion: `❓ <b>Phase 1: The Letter Question</b>

Please send the <b>Letter Question/Prompt</b>.
You can:
• Copy-paste the question text.
• Send a photo of the question.
• Tap the button below if the question is already inside your letter file.`,

    promptLetter: `✍️ <b>Phase 2: The Letter</b>

Please send your <b>Letter</b> now.
You can:
• Copy-paste your letter text directly.
• Upload a document file (<code>.pdf</code> or <code>.docx</code>).`,

    invalidFile:
      "⚠️ <b>Invalid File Type!</b> Please upload only <code>.pdf</code> or <code>.docx</code> documents, or send plain text.",
    processing:
      "⏳ <b>Analyzing your essay...</b>\nOur AI is evaluating your writing. Please wait up to 30 seconds.",
    processingLetter:
      "⏳ <b>Analyzing your letter...</b>\nOur AI is evaluating your writing. Please wait up to 30 seconds.",
    processingImage:
      "📸 <b>Processing question and analyzing essay...</b>",

    insufficientCredits: `💡 <b>Get More Credits</b>

You have <code>{credits} credits</code> left. Credits can be used for both Essay and Letter checking! Choose a plan that works for you:

📦 <b>Our Plans:</b>
• <b>Starter</b>: 5 credits → 9,900 UZS
• <b>Popular</b>: 13 credits → {popularPrice} UZS ⭐ {popularBadge}
• <b>Premium</b>: 25 credits → 29,900 UZS

Select a package below to get payment details!`,

    receiptReceived:
      "✅ <b>Payment received!</b> We're verifying your transaction. You'll be notified once approved.",

    alreadyPaidPrompt: "📸 <b>Upload Payment Receipt</b>\nShare your payment confirmation screenshot.",

    checkCancelled: "✅ Check cancelled. No credits were used.",

    bonusInstructions: `🎁 <b>Bonus Program</b>

Share your promo code with friends and earn discounts!

📋 <b>How it works:</b>
1. Click "Get Promo Code" to receive your unique code
2. Share it with your friends
3. When 5 friends use your code, you unlock <b>13 credits for only 14,900 UZS</b> instead of 19,900!
4. Each user can redeem 1 promo code maximum

🎯 <b>Requirements:</b>
• You can only redeem 1 promo code
• Your friends get no discount, but you do!`,

    btnGetPromoCode: "📲 Get Promo Code",
    btnEnterPromoCode: "✅ Enter Promo Code",

    promoCodeGenerated: `✨ <b>Your Promo Code:</b>

<code>{promoCode}</code>

Share this code with your friends! When 5 friends use your code, you'll unlock a special bonus discount.

<b>Your Progress:</b> {count}/5 friends used your code`,

    enterPromoCodePrompt: "📝 Please send the promo code (just the code, nothing else):",

    promoCodeInvalid: "❌ Invalid promo code. Please check and try again.",

    promoCodeAlreadyUsed: "❌ You have already used a promo code. You can only use one.",

    promoCodeSuccess: `✅ <b>Promo code applied!</b>

Your referrer's discount will become active once they reach 5 users! You'll automatically get the bonus discount when they complete the requirement.`,

    promoCodeUsed: `🎉 <b>Your code was used!</b>

User has redeemed your promo code.

<b>Progress:</b> {count}/5 users completed

{progressMessage}`,

    promoCodeFull: `🎉 <b>Congratulations! Your bonus is unlocked!</b>

You now have 5/5 users completed! 🏆

You can now buy <b>13 credits for 14,900 UZS</b> instead of 19,900!

Use the /credits command or tap "💳 Buy Credits" button.`,

    buyCreditsInfo: `💳 <b>Buy Credits</b>

Choose your perfect plan to grade your Essays and Letters:

📦 <b>Payment Plans:</b>
• <b>Starter</b> — 5 credits: 9,900 UZS
• <b>Popular</b> — 13 credits: {popularPrice} UZS ⭐ {popularBadge}
• <b>Premium</b> — 25 credits: 29,900 UZS (Save 16%)

🎁 <b>Why Choose Us?</b>
✓ Instant activation
✓ Professional AI feedback
✓ Secure payment
✓ 24/7 support

Select a package below to get payment details!`,

    btnStarter: "📦 Starter (5 credits) — 9,900 UZS",
    btnPopular: "⭐ Popular (13 credits) — {price} UZS",
    btnPremium: "💎 Premium (25 credits) — 29,900 UZS",
    paymentInstructions: `💳 <b>Payment Details for {packageName}</b>

🔐 <b>Payment Card:</b> <code>5614 6822 1586 0018</code>
👤 <b>Name:</b> Nurmatov Muydin
💵 <b>Amount:</b> <code>{price} UZS</code>

<b>Simple Steps:</b>
1. Transfer the exact amount using your Uzcard or Humo.
2. Take a screenshot of the receipt.
3. 📷 Upload the screenshot (image file) directly to this chat.

Our team will verify the payment and credit your account immediately!`,

    errorDocx:
      "❌ Failed to read the Word Document (.docx). Please check if it is corrupted or send plain text.",
    errorPdf:
      "❌ Failed to read the PDF document. Please ensure it has selectable text or copy-paste it directly.",
    errorGeneral:
      "❌ An error occurred while processing your request. Please try again or contact support /contact.",

    // Admin notifications (sent in English to the admin always)
    adminReceiptNotify: `🔔 <b>New Payment Receipt!</b>
👤 <b>User:</b> @{username}
🆔 <b>User ID:</b> <code>{userId}</code>
🌐 <b>Language:</b> {language}
📦 <b>Selected Package:</b> {packageInfo}

Please verify the receipt image and choose an action below.`,

    adminApproved: "✅ Approved user @{username} (+5 credits).",
    adminDenied: "❌ Denied user @{username}.",

    paymentApproved:
      "🎉 <b>Payment Confirmed!</b>\n✅ {credits} credits added to your account. Ready to grade? Type /check or /letter",
    paymentDenied:
      "⚠️ <b>Payment Could Not Be Verified</b>\nPlease check your receipt and try again. Contact us: @identitynull",
  },

  uz: {
    languageSelected: "🇺🇿 O'zbek tili muvaffaqiyatli tanlandi!",
    welcome: `✨ <b>IELTS & CEFR Examiner Botiga Xush Kelibsiz</b> ✨

Sizning AI-asosiy yozma o'qitgichingiz, <b>Anthropic Claude</b> orqali ishlaydigan

IELTS insholaringiz va CEFR Letter laringiz bo'yicha darhol batafsil fikr-mulohaza oling, haqiqiy imtihon oluvchi kabi professional baholash bilan.

📊 <b>Joriy Balans:</b> <code>{credits} ta tekshiruv</code>

🚀 <b>Boshlash:</b>
1. "📝 Inshoni tekshirish", "📩 Letter tekshirish" tugmasini bosing yoki /check, /letter yuboring
2. Savolni baham ko'ring (yoki o'tkazib yuborish mumkin)
3. Insho yoki Letteringizni yuklang (matn, PDF yoki DOCX)
4. Bir necha soniyada batafsil baholar oling!`,

    help: `📖 <b>Insho va Letter Examiner Qo'llanmasi</b>

Yozma ishlar bo'yicha fikr-mulohaza olish uchun qadamlarni bajaring:

1️⃣ <b>Boshlash</b> — /check, /letter yuboring yoki tekshirish tugmalarini bosing
2️⃣ <b>Savol</b> — Mavzuni yuboring yoki o'tkazib yuborish mumkin
3️⃣ <b>Yozma ish</b> — Insho yoki maktubingizni baham ko'ring (matn, PDF yoki DOCX)
4️⃣ <b>Fikr-mulohaza</b> — Darhol professional baholash hisoboti

<b>Asosiy Buyruqlar:</b>
/start — Botni qayta boshlash
/help — Bu qo'llanmani ko'rish
/commands — Barcha buyruqlar
/check — Inshoni baholash
/letter — Letter baholash
/credits — Kredit sotib olish
/profile — Akkauntni ko'rish`,

    commandsList: `💻 <b>Mavjud Buyruqlar:</b>

/start — Qayta boshlash / Til o'zgartirish
/check — Inshoni tekshirish
/letter — Letter tekshirish
/profile — Akkauntni ko'rish
/credits — Kredit sotib olish
/help — To'liq qo'llanma
/contact — Biz bilan aloqa`,

    contact: `📞 <b>Aloqa va Qo'llab-quvvatlash</b>

Yordam, qo'llab-quvvatlash va savollar uchun bizning jamoaviy guruhga qo'shiling:

👥 <b>Jamoaviy Guruhi:</b> Qo'shilish uchun quyidagi tugmani bosing`,

    profile: `👤 <b>Sizning Profilingiz</b>

• <b>Telegram:</b> @{username}
• <b>ID:</b> <code>{userId}</code>
• <b>Til:</b> 🇺🇿 O'zbekcha
• <b>Balans:</b> <code>{credits} ta tekshiruv remaining</code>`,

    btnCheck: "📝 Inshoni tekshirish",
    btnLetterCheck: "📩 Letter tekshirish",
    btnProfile: "👤 Profil",
    btnHelp: "📖 Yordam",
    btnContact: "💬 Aloqa",
    btnChangeLanguage: "🌐 Til",
    btnBuyCredits: "💳 Kredit sotib olish",
    btnBonus: "🎁 Bonus",
    btnProgress: "📊 Progress",
    btnContactDirectly: "💬 Biz bilan gaplashing",
    menuUpdated: "⬇️ Quyidagi tugmalardan foydalanishingiz mumkin:",
    progressNotEnoughEssays: `📊 <b>Jarayon tahlili</b>

Yozish bo'yicha jarayoningizni tahlil qilish va batafsil fikr-mulohaza berish uchun bizga kamida <b>2 ta insho</b> kerak bo'ladi.

Iltimos, /check buyrug'i yoki menyu orqali ko'proq insho yuboring, so'ngra jarayoningizni qayta tekshiring! ✍️`,
    progressAnalyzing: `⏳ <b>Insholar tarixi tahlil qilinmoqda...</b>
AI sizning oldingi insholaringizni solishtirib, jarayon tahlilini tayyorlamoqda. Iltimos, kuting.`,

    promptQuestion: `❓ <b>1-bosqich: Insho savoli</b>

Iltimos, <b>Insho savolini</b> yuboring.
Siz:
• Savol matnini nusxalab yuborishingiz,
• Savol rasmini yuborishingiz,
• Yoki savol insho faylining ichida bo'lsa, quyidagi tugmani bosishingiz mumkin.`,

    btnSkipQuestion: "⏩ Savol PDF/Doc ichida (O'tkazib yuborish)",
    questionSkipped: "✅ Savol o'tkazib yuborildi. 2-bosqichga o'tilmoqda.",

    promptEssay: `✍️ <b>2-bosqich: Insho</b>

Iltimos, <b>Inshongizni</b> yuboring.
Siz:
• Insho matnini to'g'ridan-to'g'ri yozib yuborishingiz,
• Yoki <code>.pdf</code> / <code>.docx</code> formatdagi fayl yuklashingiz mumkin.`,

    promptLetterQuestion: `❓ <b>1-bosqich: Letter savoli</b>

Iltimos, <b>Letter savolini</b> yuboring.
Siz:
• Savol matnini nusxalab yuborishingiz,
• Savol rasmini yuborishingiz,
• Yoki savol Letter faylining ichida bo'lsa, quyidagi tugmani bosishingiz mumkin.`,

    promptLetter: `✍️ <b>2-bosqich: Letter</b>

Iltimos, <b>Letterni</b> yuboring.
Siz:
• Letter matnini to'g'ridan-to'g'ri yozib yuborishingiz,
• Yoki <code>.pdf</code> / <code>.docx</code> formatdagi fayl yuklashingiz mumkin.`,

    invalidFile:
      "⚠️ <b>Noto'g'ri fayl turi!</b> Iltimos, faqat <code>.pdf</code> yoki <code>.docx</code> hujjat yuklang yoki oddiy matn ko'rinishida yuboring.",
    processing:
      "⏳ <b>Insho tahlil qilinmoqda...</b> \nIELTS AI Examiner inshongizni tekshirmoqda. Iltimos, 30 soniyagacha kuting.",
    processingLetter:
      "⏳ <b>Letter tahlil qilinmoqda...</b> \nAI Examiner maktubingizni tekshirmoqda. Iltimos, 30 soniyagacha kuting.",
    processingImage:
      "📸 <b>Rasm tahlil qilinmoqda va yozma ish tekshirilmoqda...</b>",

    insufficientCredits: `💡 <b>Kredit xarid qiling!</b>

Sizda <code>{credits} ta kredit</code> qoldi. O'zingizga mos rejani tanlang:

📦 <b>Bizning Paketlar:</b>
• <b>Boshlang'ich</b>: 5 kredit → 9.900 so'm
• <b>Mashhur</b>: 13 kredit → {popularPrice} so'm ⭐ {popularBadge}
• <b>Premium</b>: 25 kredit → 29.900 so'm

To'lov ma'lumotlarini olish uchun quyidagi paketlardan birini tanlang!`,

    receiptReceived:
      "✅ <b>To'lov qabul qilindi!</b> Biz operatsiyangizni tekshirmoqdamiz. Tasdiqlangach, sizga xabar yuboriladi.",

    alreadyPaidPrompt: "📸 <b>To'lov Chekini Yuklang</b>\nTo'lovning skrinshtini yuboring.",

    checkCancelled: "✅ Tekshirish bekor qilindi. Kredit ishlatilmadi.",

    bonusInstructions: `🎁 <b>Bonus Dasturi</b>

Promo kodingizni do'stlaringiz bilan baham ko'ring va chegirma oling!

📋 <b>Qanday ishlaydi:</b>
1. "Get Promo Code" tugmasini bosing va kodingizni oling
2. Uni do'stlaringiz bilan baham ko'ring
3. 5 odam kodingizdan foydalanganida, siz <b>13 kreditni 14,900 so'mga</b> almashtirasiz (19,900 o'rniga)!
4. Har bir foydalanuvchi faqat 1 ta promo koddan foydalana oladi

🎯 <b>Shartlar:</b>
• Siz faqat 1 ta promo koddan foydalana olasiz
• Do'stlaringiz chegirma olmaydi, lekin siz olasiz!`,

    btnGetPromoCode: "📲 Promo Kod Oling",
    btnEnterPromoCode: "✅ Promo Kod Kiriting",

    promoCodeGenerated: `✨ <b>Sizning Promo Kodingiz:</b>

<code>{promoCode}</code>

Ushbu kodni do'stlaringiz bilan baham ko'ring! 5 odam kodingizdan foydalanganida, siz bonus chegirmasini ochgan bo'lasiz.

<b>Sizning Jarayoningiz:</b> {count}/5 do'st kodingizdan foydalandi`,

    enterPromoCodePrompt: "📝 Promo kodini yuboring (faqat kod, boshqa hech nima yo'q):",

    promoCodeInvalid: "❌ Noto'g'ri promo kod. Iltimos, tekshiring va qaytadan urinib ko'ring.",

    promoCodeAlreadyUsed: "❌ Siz allaqachon promo koddan foydalandingiz. Siz faqat birdan foydalana olasiz.",

    promoCodeSuccess: `✅ <b>Promo kod qo'shildi!</b>

Sizning chegirmangiz tayyor bo'ladi! Ular 5 kishiga yetganda siz avtomatik ravishda bonus chegirmani olasiz.`,

    promoCodeUsed: `🎉 <b>Sizning kodi ishlatildi!</b>

Foydalanuvchi sizning promo kodingizni qabul qildi.

<b>Jarayon:</b> {count}/5 foydalanuvchi tugadi

{progressMessage}`,

    promoCodeFull: `🎉 <b>Tabriklaymiz! Sizning bonus ochildi!</b>

Siz 5/5 foydalanuvchiga erishdingiz! 🏆

Endi siz <b>19,900 o'rniga 14,900 so'mga 13 kredit</b> sotib olishingiz mumkin!

/credits buyruqidan yoki "💳 Kredit Sotib Olish" tugmasidan foydalaning.`,

    buyCreditsInfo: `💳 <b>Kredit Sotib Olish</b>

Insholar va Letter larni tekshirish uchun o'zingizga mos rejani tanlang:

📦 <b>To'lov Rejalari:</b>
• <b>Boshlang'ich</b> — 5 kredit: 9.900 so'm
• <b>Mashhur</b> — 13 kredit: {popularPrice} so'm ⭐ {popularBadge}
• <b>Premium</b> — 25 kredit: 29.900 so'm (16% tejash)

🎁 <b>Nima uchun biz?</b>
✓ Darhol aktivlash
✓ Professional AI fikr-mulohaza
✓ Xavfsiz to'lov
✓ 24/7 yordam

To'lov ma'lumotlarini olish uchun quyidagi paketlardan birini tanlang!`,

    btnStarter: "📦 Boshlang'ich (5 kredit) — 9,900 so'm",
    btnPopular: "⭐ Mashhur (13 kredit) — {price} so'm",
    btnPremium: "💎 Premium (25 kredit) — 29,900 so'm",
    paymentInstructions: `💳 <b>{packageName} uchun to'lov ma'lumotlari</b>

🔐 <b>Karta:</b> <code>5614 6822 1586 0018</code>
👤 <b>Ism:</b> Nurmatov Muydin
💵 <b>Suma:</b> <code>{price} so'm</code>

<b>Oson qadamlar:</b>
1. Uzcard yoki Humo orqali to'lov qiling.
2. Chekning skrinshtini oling.
3. 📷 Chek rasmini to'g'ridan-to'g'ri ushbu chatga yuklang.

Bizning jamoa tezda tekshiradi va yaqin orada kreditni qo'shadi!`,

    errorDocx:
      "❌ Word hujjatini (.docx) o'qib bo'lmadi. Fayl buzilmaganligini tekshiring yoki matn sifatida yuboring.",
    errorPdf:
      "❌ PDF hujjatini o'qib bo'lmadi. Undagi matn tanlanadigan ekanligiga ishonch hosil qiling yoki matn sifatida yuboring.",
    errorGeneral:
      "❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring yoki /contact orqali bog'laning.",

    paymentApproved:
      "🎉 <b>To'lov Tasdiqlandi!</b> \n✅ {credits} kredit hisobingizga qo'shildi. Boshlashga tayyormisiz? /check yoki /letter yozing!",
    paymentDenied:
      "⚠️ <b>To'lov Tasdiqlanmadi</b> \nChekingizni qayta tekshiring va urinib ko'ring. Aloqa: @identitynull",
  },

  ru: {
    languageSelected: "🇷🇺 Русский язык успешно выбран!",
    welcome: `✨ <b>Добро пожаловать в IELTS & CEFR Examiner</b> ✨

Ваш AI-помощник, работающий на <b>Anthropic Claude</b>

Получайте мгновенную, профессиональную обратную связь по вашим IELTS эссе и CEFR письмам с оценками по критериям, как у реального экзаменатора.

📊 <b>Ваш Баланс:</b> <code>{credits} проверок</code>

🚀 <b>Начните Сейчас:</b>
1. Нажмите "📝 Проверить эссе", "📩 Проверить письмо" или отправьте /check, /letter
2. Поделитесь темой (или пропустите, если она в документе)
3. Загрузите эссе или письмо (текст, PDF или DOCX)
4. Получите детальную оценку за секунды!`,

    help: `📖 <b>Руководство по AI Essay & Letter Examiner</b>

Выполните простые шаги для получения обратной связи:

1️⃣ <b>Начало</b> — Отправьте /check, /letter или нажмите кнопки проверки
2️⃣ <b>Тема</b> — Поделитесь темой или пропустите, если она в документе
3️⃣ <b>Работа</b> — Загрузите эссе или письмо (текст, PDF или DOCX)
4️⃣ <b>Отзыв</b> — Получите мгновенный профессиональный анализ

<b>Основные Команды:</b>
/start — Перезапуск бота
/help — Эта инструкция
/commands — Все команды
/check — Проверить эссе
/letter — Проверить CEFR письмо
/credits — Купить кредиты
/profile — Аккаунт`,

    commandsList: `💻 <b>Доступные команды:</b>

/start — Перезапуск / Язык
/check — Проверить эссе
/letter — Проверить CEFR письмо
/profile — Ваш аккаунт
/credits — Купить кредиты
/help — Полное руководство
/contact — Контакт`,

    contact: `📞 <b>Контакты и Поддержка</b>

Присоединяйтесь к нашей группе сообщества для помощи и поддержки:

👥 <b>Группа Сообщества:</b> Нажмите кнопку ниже, чтобы присоединиться`,

    profile: `👤 <b>Ваш профиль</b>

• <b>Телеграм:</b> @{username}
• <b>ID:</b> <code>{userId}</code>
• <b>Язык:</b> 🇷🇺 Русский
• <b>Баланс:</b> <code>{credits} проверок remaining</code>`,

    btnCheck: "📝 Проверить эссе",
    btnLetterCheck: "📩 Проверить письмо",
    btnProfile: "👤 Профиль",
    btnHelp: "📖 Помощь",
    btnContact: "💬 Контакт",
    btnChangeLanguage: "🌐 Язык",
    btnBuyCredits: "💳 Купить кредиты",
    btnBonus: "🎁 Bonus",
    btnProgress: "📊 Прогресс",
    btnContactDirectly: "💬 Написать нам",
    menuUpdated: "⬇️ Вы можете использовать кнопки ниже:",
    progressNotEnoughEssays: `📊 <b>Анализ Прогресса</b>

Чтобы проанализировать ваш прогресс в письме и предоставить подробный отзыв, нам нужно сравнить как минимум <b>2 эссе</b>.

Пожалуйста, отправьте больше эссе с помощью команды /check или меню ниже, а затем проверьте свой прогресс снова! ✍️`,
    progressAnalyzing: `⏳ <b>Анализ истории ваших эссе...</b>
Наш ИИ изучает ваши предыдущие работы для составления подробного отчета о прогрессе. Пожалуйста, подождите.`,

    promptQuestion: `❓ <b>Шаг 1: Тема (Вопрос) эссе</b>

Пожалуйста, отправьте <b>тему эссе</b>.
Вы можете:
• Скопировать и вставить текст темы.
• Отправить фото темы.
• Нажать кнопку ниже, если тема уже содержится в файле вашего эссе.`,

    btnSkipQuestion: "⏩ Пропустить, если вопрос в PDF/Doc",
    questionSkipped: "✅ Тема пропущена. Переходим к Шагу 2.",

    promptEssay: `✍️ <b>Шаг 2: Ваше эссе</b>

Пожалуйста, отправьте ваше <b>эссе</b>.
Вы можете:
• Скопировать и вставить текст вашего эссе.
• Загрузить файл документа (<code>.pdf</code> или <code>.docx</code>).`,

    promptLetterQuestion: `❓ <b>Шаг 1: Тема (Вопрос) письма</b>

Пожалуйста, отправьте <b>тему письма</b>.
Вы можете:
• Скопировать и вставить текст темы.
• Отправить фото темы.
• Нажать кнопку ниже, если тема уже содержится в файле вашего письма.`,

    promptLetter: `✍️ <b>Шаг 2: Ваше письмо</b>

Пожалуйста, отправьте ваше <b>письмо</b>.
Вы можете:
• Скопировать и вставить текст вашего письма напрямую.
• Загрузить файл документа (<code>.pdf</code> или <code>.docx</code>).`,

    invalidFile:
      "⚠️ <b>Неверный формат файла!</b> Пожалуйста, загружайте только документы <code>.pdf</code> или <code>.docx</code> или отправьте текст напрямую.",
    processing:
      "⏳ <b>Обработка и анализ вашего эссе...</b> \nИИ-экзаменатор оценивает ваше письмо. Пожалуйста, подождите до 30 секунд.",
    processingLetter:
      "⏳ <b>Обработка и анализ вашего письма...</b> \nИИ-экзаменатор оценивает ваше письмо. Пожалуйста, подождите до 30 секунд.",
    processingImage: "📸 <b>Обработка изображения темы и анализ работы...</b>",

    insufficientCredits: `💡 <b>Получите кредиты!</b>

У вас осталось <code>{credits} кредитов</code>. Выберите подходящий пакет:

📦 <b>Наши Пакеты:</b>
• <b>Стартовый</b>: 5 кредитов → 9.900 сум
• <b>Популярный</b>: 13 кредитов → {popularPrice} сум ⭐ {popularBadge}
• <b>Премиум</b>: 25 кредитов → 29.900 сум

Выберите пакет ниже для получения деталей оплаты!`,

    receiptReceived:
      "✅ <b>Платеж получен!</b> Мы проверяем вашу транзакцию. Вы получите уведомление после подтверждения.",

    alreadyPaidPrompt: "📸 <b>Загрузите Чек Платежа</b>\nПоделитесь скриншотом подтверждения.",

    checkCancelled: "✅ Проверка отменена. Кредиты не были использованы.",

    bonusInstructions: `🎁 <b>Бонусная программа</b>

Поделитесь своим промо-кодом с друзьями и получите скидку!

📋 <b>Как это работает:</b>
1. Нажмите "Get Promo Code" чтобы получить уникальный код
2. Поделитесь им с друзьями
3. Когда 5 друзей используют ваш код, вы разблокируете <b>13 проверок за 14,900 сум</b> вместо 19,900!
4. Каждый пользователь может использовать только 1 промо-код

🎯 <b>Условия:</b>
• Вы можете использовать только 1 промо-код
• Ваши друзья не получают скидку, но вы получите!`,

    btnGetPromoCode: "📲 Получить Промо-код",
    btnEnterPromoCode: "✅ Ввести Промо-код",

    promoCodeGenerated: `✨ <b>Ваш Промо-код:</b>

<code>{promoCode}</code>

Поделитесь этим кодом с друзьями! Когда 5 друзей используют ваш код, вы разблокируете специальный бонус.

<b>Ваш Прогресс:</b> {count}/5 друзей использовали код`,

    enterPromoCodePrompt: "📝 Отправьте промо-код (только код, ничего больше):",

    promoCodeInvalid: "❌ Неверный промо-код. Пожалуйста, проверьте и попробуйте снова.",

    promoCodeAlreadyUsed: "❌ Вы уже использовали промо-код. Вы можете использовать только один.",

    promoCodeSuccess: `✅ <b>Промо-код применен!</b>

Бонусная скидка владельца кода станет активной, когда 5 пользователей применят его код! Вы автоматически получите бонусную скидку, когда условие будет выполнено.`,

    promoCodeUsed: `🎉 <b>Ваш код был использован!</b>

Пользователь применил ваш промо-код.

<b>Прогресс:</b> {count}/5 пользователей завершили

{progressMessage}`,

    promoCodeFull: `🎉 <b>Поздравляем! Ваш бонус разблокирован!</b>

Вы достигли 5/5 пользователей! 🏆

Теперь вы можете купить <b>13 проверок за 14,900 сум</b> вместо 19,900!

Используйте команду /credits или нажмите кнопку "💳 Купить Кредиты".`,

    buyCreditsInfo: `💳 <b>Купить Кредиты</b>

Выберите подходящий пакет для проверки ваших эссе и писем:

📦 <b>Наши Планы:</b>
• <b>Стартовый</b> — 5 кредитов: 9.900 сум
• <b>Популярный</b> — 13 кредитов: {popularPrice} сум ⭐ {popularBadge}
• <b>Премиум</b> — 25 кредитов: 29.900 сум (Экономия 16%)

🎁 <b>Почему выбирают нас?</b>
✓ Мгновенная активация
✓ Профессиональная обратная связь
✓ Безопасный платеж
✓ Поддержка 24/7

Выберите пакет ниже для получения деталей оплаты!`,

    btnStarter: "📦 Стартовый (5 кредитов) — 9.900 сум",
    btnPopular: "⭐ Популярный (13 кредитов) — {price} сум",
    btnPremium: "💎 Премиум (25 кредитов) — 29.900 сум",
    paymentInstructions: `💳 <b>Детали оплаты для {packageName}</b>

🔐 <b>Карта:</b> <code>5614 6822 1586 0018</code>
👤 <b>Получатель:</b> Нурматов Муйдин
💵 <b>Сумма:</b> <code>{price} сум</code>

<b>Три простых шага:</b>
1. Переведите точную сумму через Uzcard или Humo.
2. Сделайте скриншот чека.
3. 📷 Отправьте скриншот (изображение) напрямую в этот чат.

Наша команда проверит платеж и сразу начислит кредиты!`,

    errorDocx:
      "❌ Не удалось прочитать документ Word (.docx). Проверьте файл или отправьте текст напрямую.",
    errorPdf:
      "❌ Не удалось прочитать PDF-документ. Убедитесь, что текст в нем выделяется, или скопируйте его напрямую.",
    errorGeneral:
      "❌ Произошла ошибка. Пожалуйста, попробуйте еще раз или свяжитесь с поддержкой /contact.",

    paymentApproved:
      "🎉 <b>Платеж Подтвержден!</b> \n✅ {credits} кредитов добавлены. Готовы начать? Отправьте /check или /letter",
    paymentDenied:
      "⚠️ <b>Платеж Не Проверен</b> \nПожалуйста, проверьте чек и попробуйте снова. Контакт: @identitynull",
  },
};
