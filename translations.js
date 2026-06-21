export const translations = {
  en: {
    languageSelected: "🇬🇧 English selected successfully!",
    welcome: `✨ <b>Welcome to IELTS Essay Examiner!</b> ✨

Hi there! I am your AI-powered IELTS Writing Examiner, powered by <b>Google Gemini</b>. I can grade your essays and give you detailed criteria-based feedback just like a real examiner.

<b>Current Balance:</b> <code>{credits} credits</code>

<b>Quick Start:</b>
1. Press /check or tap "📝 Check Essay".
2. Send the Essay Question (or skip it).
3. Submit your Essay (text or .pdf/.docx file).
4. Get instant detailed feedback!`,

    help: `📖 <b>How to Use IELTS Essay Examiner</b>

Follow these simple steps to grade your writing:
1️⃣ <b>Start the process</b> by sending the /check command or tapping the "📝 Check Essay" button.
2️⃣ <b>Submit the Essay Question</b>: Copy and paste the prompt, upload an image of the prompt, or skip this step if the question is already contained in your PDF essay document.
3️⃣ <b>Submit your Essay</b>: Copy and paste your written essay or upload a document format (<code>.pdf</code> or <code>.docx</code>).
4️⃣ <b>Wait for Analysis</b>: The AI will evaluate your writing and deliver a detailed score report based on the official IELTS band descriptors.

<b>Commands:</b>
/start - Start or restart the bot
/help - Show instructions
/commands - List all available commands
/contact - Admin contact info
/check - Start grading an essay
/profile - View your credits and status`,

    commandsList: `💻 <b>Available Commands:</b>

• /start - Restart the bot / Change language
• /help - Guide on using the bot
• /commands - Show this command list
• /contact - Support & manual payment confirmation
• /check - Initiate IELTS essay grading
• /profile - Check your account credits`,

    contact: `📞 <b>Contact & Support</b>

Join our community group for help, support, and questions:

👥 <b>Community Group:</b> Click the button below to join`,

    profile: `👤 <b>Your Profile</b>

• <b>Username:</b> @{username}
• <b>User ID:</b> <code>{userId}</code>
• <b>Language:</b> 🇬🇧 English
• <b>Credits:</b> <code>{credits} essays remaining</code>`,

    btnCheck: "📝 Check Essay",
    btnProfile: "👤 Profile",
    btnHelp: "📖 Help",
    btnContact: "📞 Contact Admin",
    btnChangeLanguage: "🌐 Change Language",
    btnBuyCredits: "💳 Buy Credits",
    btnBonus: "🎁 Bonus",
    btnContactDirectly: "👤 Chat with Admin",
    menuUpdated: "⬇️ You can use the menu buttons below:",

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

    invalidFile:
      "⚠️ <b>Invalid File Type!</b> Please upload only <code>.pdf</code> or <code>.docx</code> documents, or send plain text.",
    processing:
      "⏳ <b>Processing and Analyzing your essay...</b> \nOur IELTS AI Examiner is evaluating your writing. Please wait up to 30 seconds.",
    processingImage:
      "📸 <b>Processing question image and analyzing essay...</b>",

    insufficientCredits: `🚫 <b>Buy Credits!</b>

You currently have <code>{credits} credits</code> remaining. To grade more essays, purchase a premium package.

💳 <b>Premium Packages:</b>
• <b>IELTS Express (10 credits)</b>: 25,000 UZS
• <b>IELTS Bonus (10 credits)</b>: 15,000 UZS (with promo code)

🔒 <b>Payment Details (Manual Uzcard/Humo):</b>
• <b>Card Number:</b> <code>5614 6822 1586 0018</code>
• <b>Recipient Name:</b> Nurmatov Muydin.

<b>How to Pay:</b>
1. Transfer the amount to the card above.
2. <b>Screenshot/Photo the receipt</b>.
3. <b>Send the receipt photo</b> using the "Already Paid" button!

Once you send the photo, our admin will verify and credit your account immediately.`,

    receiptReceived:
      "✅ <b>Receipt Received!</b> Your receipt has been sent to the administrator for verification. You will be notified once it is approved.",

    alreadyPaidPrompt: "📷 Please send the payment receipt image (screenshot or photo of the confirmation).",

    checkCancelled: "✅ Check cancelled. No credits were used.",

    bonusInstructions: `🎁 <b>Bonus Referral Program</b>

Share your promo code with friends and earn discounts!

📋 <b>How it works:</b>
1. Click "Get Promo Code" to receive your unique code
2. Share it with your friends
3. When 5 friends use your code, you unlock <b>10 credits for only 15,000 UZS</b> instead of 25,000!
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

You now have access to the special bonus: 10 credits for 15,000 UZS instead of 25,000!
Enjoy your discount when purchasing credits.`,

    promoCodeUsed: `🎉 <b>Your code was used!</b>

User has redeemed your promo code.

<b>Progress:</b> {count}/5 users completed

${"{count}"} Completed - Unlock your bonus discount!`,

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

Please verify the receipt image and choose an action below.`,

    adminApproved: "✅ Approved user @{username} (+5 credits).",
    adminDenied: "❌ Denied user @{username}.",

    paymentApproved:
      "🎉 <b>Your payment has been approved!</b> \n10 essay credits have been added to your balance. You can now grade more essays. Type /check to start!",
    paymentDenied:
      "❌ <b>Your payment verification was rejected.</b> \nIf you believe this is a mistake, please contact support: @identitynull.",
  },

  uz: {
    languageSelected: "🇺🇿 O'zbek tili muvaffaqiyatli tanlandi!",
    welcome: `✨ <b>IELTS Essay Examiner Botiga xush kelibsiz!</b> ✨

Assalomu alaykum! Men sizning <b>Google Gemini</b> texnologiyasida ishlaydigan sun'iy intellektli IELTS yozma imtihon tekshiruvchingizman. Men sizning insholaringizni baholab, haqiqiy imtihon oluvchi kabi batafsil fikr-mulohazalar bera olaman.

<b>Joriy balans:</b> <code>{credits} ta urinish</code>

<b>Tezkor boshlash:</b>
1. /check buyrug'ini yuboring yoki "📝 Inshoni tekshirish" tugmasini bosing.
2. Insho savolini yuboring (yoki uni o'tkazib yuboring).
3. Inshongizni matn yoki <code>.pdf</code> / <code>.docx</code> fayl ko'rinishida yuboring.
4. Bir necha soniyada batafsil natijani oling!`,

    help: `📖 <b>IELTS Essay Examiner'dan foydalanish yo'riqnomasi</b>

Inshongizni tekshirish uchun quyidagi oddiy qadamlarni bajaring:
1️⃣ <b>Jarayonni boshlash</b>: /check buyrug'ini yuboring yoki pastdagi "📝 Inshoni tekshirish" tugmasini bosing.
2️⃣ <b>Insho savolini yuboring</b>: Savol matnini nusxalab yuboring, rasmini yuboring yoki savol PDF fayl ichida bo'lsa, "O'tkazib yuborish" tugmasini bosing.
3️⃣ <b>Inshoni yuboring</b>: Insho matnini nusxalab yuboring yoki <code>.pdf</code> / <code>.docx</code> fayl ko'rinishida yuklang.
4️⃣ <b>Tahlilni kuting</b>: Sun'iy intellekt inshongizni IELTS mezonlari bo'yicha baholaydi va batafsil hisobotni yuboradi.

<b>Buyruqlar:</b>
/start - Botni boshlash / qayta ishga tushirish
/help - Qo'llanmanki ko'rish
/commands - Barcha buyruqlar ro'yxati
/contact - Admin aloqa ma'lumotlari
/check - Inshoni tekshirishni boshlash
/profile - Balans va profil ma'lumotlari`,

    commandsList: `💻 <b>Mavjud buyruqlar:</b>

• /start - Botni qayta ishga tushirish / Tilni o'zgartirish
• /help - Foydalanish bo'yicha qo'llanma
• /commands - Buyruqlar ro'yxati
• /contact - Admin va qo'llab-quvvatlash
• /check - Inshoni tahlil qilishni boshlash
• /profile - Balansni tekshirish`,

    contact: `📞 <b>Aloqa va Qo'llab-quvvatlash</b>

Yordam, qo'llab-quvvatlash va savollar uchun bizning jamoaviy guruhga qo'shiling:

👥 <b>Jamoaviy Guruhi:</b> Qo'shilish uchun quyidagi tugmani bosing`,

    profile: `👤 <b>Sizning Profilingiz</b>

• <b>Telegram:</b> @{username}
• <b>ID:</b> <code>{userId}</code>
• <b>Til:</b> 🇺🇿 O'zbekcha
• <b>Balans:</b> <code>{credits} ta insho</code>`,

    btnCheck: "📝 Inshoni tekshirish",
    btnProfile: "👤 Profil",
    btnHelp: "📖 Yordam",
    btnContact: "📞 Admin bilan aloqa",
    btnChangeLanguage: "🌐 Tilni o'zgartirish",
    btnBuyCredits: "💳 Kredit sotib olish",
    btnBonus: "🎁 Bonus",
    btnContactDirectly: "👤 Admin bilan bog'lanish",
    menuUpdated: "⬇️ Quyidagi tugmalardan foydalanishingiz mumkin:",

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

    invalidFile:
      "⚠️ <b>Noto'g'ri fayl turi!</b> Iltimos, faqat <code>.pdf</code> yoki <code>.docx</code> hujjat yuklang yoki oddiy matn ko'rinishida yuboring.",
    processing:
      "⏳ <b>Insho tahlil qilinmoqda...</b> \nIELTS AI Examiner inshongizni tekshirmoqda. Iltimos, 30 soniyagacha kuting.",
    processingImage:
      "📸 <b>Rasm tahlil qilinmoqda va insho tekshirilmoqda...</b>",

    insufficientCredits: `🚫 <b>Kredit xarid qiling!</b>

Sizda hozir <code>{credits} ta kredit</code> qoldi. Insho tekshirishda davom etish uchun premium paket xarid qiling.

💳 <b>Premium Paketlar:</b>
• <b>IELTS Express (10 ta urinish)</b>: 25,000 so'm
• <b>IELTS Bonus (10 ta urinish)</b>: 15,000 so'm (promo kod bilan)

🔒 <b>To'lov ma'lumotlari (Uzcard/Humo):</b>
• <b>Karta raqami:</b> <code>5614 6822 1586 0018</code>
• <b>Karta egasi:</b> Nurmatov Muydin.

<b>To'lov qilish usuli:</b>
1. Yuqoridagi kartaga to'lovni amalga oshiring.
2. <b>To'lov chekini rasmga/skrinshotga oling</b>.
3. <b>Chek rasmini "Already Paid" tugmasi bilan yuboring!</b>

Rasm qabul qilingandan so'ng, adminimiz kavolatni tekshiradi va hisobingizga urinishlarni qo'shib beradi.`,

    receiptReceived:
      "✅ <b>Chek qabul qilindi!</b> Sizning to'lov chekingiz tasdiqlash uchun adminga yuborildi. To'lov tasdiqlangach, sizga xabar yuboriladi.",

    alreadyPaidPrompt: "📷 Iltimos, to'lov chekining rasmini yuboring (skrinshot yoki tasdiqlash fotosurati).",

    checkCancelled: "✅ Tekshirish bekor qilindi. Kredit ishlatilmadi.",

    bonusInstructions: `🎁 <b>Bonus Referral Dasturi</b>

Promo kodingizni do'stlaringiz bilan baham ko'ring va chegirma oling!

📋 <b>Qanday ishlaydi:</b>
1. "Get Promo Code" tugmasini bosing va kodingizni oling
2. Uni do'stlaringiz bilan baham ko'ring
3. 5 odam kodingizdan foydalanganida, siz <b>10 kreditni 15,000 so'mga</b> almashtirasiz (25,000 o'rniga)!
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

Endi sizda maxsus bonus mavjud: 25,000 o'rniga 10 kreditni 15,000 so'mga!
Kredit sotib olganizda chegirmadan foydalaning.`,

    promoCodeUsed: `🎉 <b>Sizning kodi ishlatildi!</b>

Foydalanuvchi sizning promo kodingizni qabul qildi.

<b>Jarayon:</b> {count}/5 foydalanuvchi tugadi

{count} Tugadi - Bonus chegirmasini oching!`,

    errorDocx:
      "❌ Word hujjatini (.docx) o'qib bo'lmadi. Fayl buzilmaganligini tekshiring yoki matn sifatida yuboring.",
    errorPdf:
      "❌ PDF hujjatini o'qib bo'lmadi. Undagi matn tanlanadigan ekanligiga ishonch hosil qiling yoki matn sifatida yuboring.",
    errorGeneral:
      "❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring yoki /contact orqali bog'laning.",

    paymentApproved:
      "🎉 <b>Sizning to'lovingiz tasdiqlandi!</b> \nHisobingizga 10 ta urinish qo'shildi. Insholaringizni tekshirishingiz mumkin. Boshlash uchun /check yozing!",
    paymentDenied:
      "❌ <b>Sizning to'lovingiz tasdiqlanmadi.</b> \nAgar xatolik yuz bergan deb o'ylasangiz, admin bilan bog'laning: @identitynull.",
  },

  ru: {
    languageSelected: "🇷🇺 Русский язык успешно выбран!",
    welcome: `✨ <b>Добро пожаловать в IELTS Essay Examiner!</b> ✨

Привет! Я ваш эксперт по проверке эссе IELTS на базе искусственного интеллекта <b>Google Gemini</b>. Я могу оценить ваше эссе и предоставить подробный разбор по критериям IELTS так же, как реальный экзаменатор.

<b>Текущий баланс:</b> <code>{credits} попыток</code>

<b>Быстрый старт:</b>
1. Наберите /check или нажмите кнопку "📝 Проверить эссе".
2. Отправьте тему эссе (или пропустите этот шаг).
3. Отправьте эссе в виде текста или документа <code>.pdf</code> / <code>.docx</code>.
4. Получите детальный отчет о баллах за несколько секунд!`,

    help: `📖 <b>Руководство по использованию бота</b>

Чтобы проверить эссе, выполните следующие действия:
1️⃣ <b>Начните процесс</b>: Отправьте команду /check или нажмите кнопку "📝 Проверить эссе".
2️⃣ <b>Отправьте тему</b>: Скопируйте и вставьте текст темы, пришлите фото вопроса или нажмите кнопку пропуска, если тема уже находится внутри вашего файла с эссе.
3️⃣ <b>Отправьте эссе</b>: Скопируйте и вставьте текст эссе или загрузите документ в формате <code>.pdf</code> / <code>.docx</code>.
4️⃣ <b>Ожидайте анализ</b>: ИИ оценит ваше письмо по критериям IELTS и отправит подробный отчет.

<b>Команды:</b>
/start - Начать / перезапустить бота
/help - Показать инструкции
/commands - Список всех команд
/contact - Контакты администрации
/check - Начать проверку эссе
/profile - Ваш баланс и статус`,

    commandsList: `💻 <b>Доступные команды:</b>

• /start - Перезапустить бота / Изменить язык
• /help - Инструкции по использованию
• /commands - Список всех команд
• /contact - Поддержка и покупка баланса
• /check - Начать проверку эссе
• /profile - Проверить баланс аккаунта`,

    contact: `📞 <b>Контакты и Поддержка</b>

Присоединяйтесь к нашей группе сообщества для помощи и поддержки:

👥 <b>Группа Сообщества:</b> Нажмите кнопку ниже, чтобы присоединиться`,

    profile: `👤 <b>Ваш профиль</b>

• <b>Телеграм:</b> @{username}
• <b>ID:</b> <code>{userId}</code>
• <b>Язык:</b> 🇷🇺 Русский
• <b>Баланс:</b> <code>{credits} эссе remaining</code>`,

    btnCheck: "📝 Проверить эссе",
    btnProfile: "👤 Профиль",
    btnHelp: "📖 Помощь",
    btnContact: "📞 Связь с админом",
    btnChangeLanguage: "🌐 Изменить язык",
    btnBuyCredits: "💳 Купить попытки",
    btnBonus: "🎁 Бонус",
    btnContactDirectly: "👤 Написать админу",
    menuUpdated: "⬇️ Вы можете использовать кнопки ниже:",

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

    invalidFile:
      "⚠️ <b>Неверный формат файла!</b> Пожалуйста, загружайте только документы <code>.pdf</code> или <code>.docx</code> или отправьте текст напрямую.",
    processing:
      "⏳ <b>Обработка и анализ вашего эссе...</b> \nИИ-экзаменатор оценивает ваше письмо. Пожалуйста, подождите до 30 секунд.",
    processingImage: "📸 <b>Обработка изображения темы и анализ эссе...</b>",

    insufficientCredits: `🚫 <b>Купите кредиты!</b>

У вас осталось <code>{credits} кредитов</code>. Для продолжения приобретите премиум-пакет.

💳 <b>Премиум-пакеты:</b>
• <b>IELTS Express (10 проверок)</b>: 25,000 сум
• <b>IELTS Bonus (10 проверок)</b>: 15,000 сум (с промо-кодом)

🔒 <b>Реквизиты для оплаты (Uzcard/Humo):</b>
• <b>Номер карты:</b> <code>5614 6822 1586 0018</code>
• <b>Получатель:</b> Нурматов Муйдин.

<b>Как оплатить:</b>
1. Переведите сумму на указанную карту.
2. <b>Сделайте скриншот чека</b> об оплате.
3. <b>Отправьте фото чека</b> нажав кнопку "Already Paid"!

После получения фото наш администратор проверит транзакцию и моментально пополнит ваш баланс.`,

    receiptReceived:
      "✅ <b>Чек получен!</b> Ваш чек отправлен администратору на верификацию. Вы получите уведомление после подтверждения платежа.",

    alreadyPaidPrompt: "📷 Пожалуйста, отправьте фото чека об оплате (скриншот или фото подтверждения).",

    checkCancelled: "✅ Проверка отменена. Кредиты не были использованы.",

    bonusInstructions: `🎁 <b>Бонусная программа рефералов</b>

Поделитесь своим промо-кодом с друзьями и получите скидку!

📋 <b>Как это работает:</b>
1. Нажмите "Get Promo Code" чтобы получить уникальный код
2. Поделитесь им с друзьями
3. Когда 5 друзей используют ваш код, вы разблокируете <b>10 проверок за 15,000 сум</b> вместо 25,000!
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

Теперь у вас есть доступ к специальному бонусу: 10 проверок за 15,000 сум вместо 25,000!
Используйте скидку при покупке кредитов.`,

    promoCodeUsed: `🎉 <b>Ваш код был использован!</b>

Пользователь применил ваш промо-код.

<b>Прогресс:</b> {count}/5 пользователей завершили

{count} Завершено - Разблокируйте бонусную скидку!`,

    errorDocx:
      "❌ Не удалось прочитать документ Word (.docx). Проверьте файл или отправьте текст напрямую.",
    errorPdf:
      "❌ Не удалось прочитать PDF-документ. Убедитесь, что текст в нем выделяется, или скопируйте его напрямую.",
    errorGeneral:
      "❌ Произошла ошибка. Пожалуйста, попробуйте еще раз или свяжитесь с поддержкой /contact.",

    paymentApproved:
      "🎉 <b>Ваш платеж подтвержден!</b> \nВам начислено 10 проверок эссе. Теперь вы можете оценивать свои эссе. Наберите /check для старта!",
    paymentDenied:
      "❌ <b>Ваш платеж отклонен.</b> \nЕсли вы считаете это ошибкой, обратитесь к администратору: @identitynull.",
  },
};
