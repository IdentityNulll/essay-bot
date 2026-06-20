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

For payment verification, questions, or custom support, please contact our administrator directly:
👤 <b>Admin:</b> @identitynull

Send your payment receipt screenshot to the bot or contact the admin if you face any issues.`,

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

    invalidFile: "⚠️ <b>Invalid File Type!</b> Please upload only <code>.pdf</code> or <code>.docx</code> documents, or send plain text.",
    processing: "⏳ <b>Processing and Analyzing your essay...</b> \nOur IELTS AI Examiner is evaluating your writing. Please wait up to 30 seconds.",
    processingImage: "📸 <b>Processing question image and analyzing essay...</b>",
    
    insufficientCredits: `🚫 <b>Out of Credits!</b>

You have <code>0</code> essay credits remaining. To grade more essays, please purchase a premium package.

💳 <b>Premium Packages:</b>
• <b>IELTS Express (5 credits)</b>: 25,000 UZS / $2.00 USD
• <b>IELTS Master (15 credits)</b>: 60,000 UZS / $5.00 USD

🔒 <b>Payment Details (Manual Uzcard/Humo):</b>
• <b>Card Number:</b> <code>8600 1234 5678 9012</code>
• <b>Recipient Name:</b> Bot Premium Upgrade

<b>How to Pay:</b>
1. Transfer the amount to the card above.
2. <b>Screenshot/Photo the receipt</b>.
3. <b>Reply directly to this message</b> with the receipt photo!

Once you send the photo, our admin will verify and credit your account immediately.`,

    receiptReceived: "✅ <b>Receipt Received!</b> Your receipt has been sent to the administrator for verification. You will be notified once it is approved.",
    
    errorDocx: "❌ Failed to read the Word Document (.docx). Please check if it is corrupted or send plain text.",
    errorPdf: "❌ Failed to read the PDF document. Please ensure it has selectable text or copy-paste it directly.",
    errorGeneral: "❌ An error occurred while processing your request. Please try again or contact support /contact.",
    
    // Admin notifications (sent in English to the admin always)
    adminReceiptNotify: `🔔 <b>New Payment Receipt!</b>
👤 <b>User:</b> @{username}
🆔 <b>User ID:</b> <code>{userId}</code>
🌐 <b>Language:</b> {language}

Please verify the receipt image and choose an action below.`,
    
    adminApproved: "✅ Approved user @{username} (+5 credits).",
    adminDenied: "❌ Denied user @{username}.",

    paymentApproved: "🎉 <b>Your payment has been approved!</b> \n5 essay credits have been added to your balance. You can now grade more essays. Type /check to start!",
    paymentDenied: "❌ <b>Your payment verification was rejected.</b> \nIf you believe this is a mistake, please contact support: @identitynull."
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

To'lovni tasdiqlash, savollar yoki takliflar bo'yicha to'g'ridan-to'g'ri administratorimizga murojaat qiling:
👤 <b>Admin:</b> @identitynull

To'lov chekini botga yuboring yoki muammolar yuzaga kelsa admin bilan bog'laning.`,

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

    invalidFile: "⚠️ <b>Noto'g'ri fayl turi!</b> Iltimos, faqat <code>.pdf</code> yoki <code>.docx</code> hujjat yuklang yoki oddiy matn ko'rinishida yuboring.",
    processing: "⏳ <b>Insho tahlil qilinmoqda...</b> \nIELTS AI Examiner inshongizni tekshirmoqda. Iltimos, 30 soniyagacha kuting.",
    processingImage: "📸 <b>Rasm tahlil qilinmoqda va insho tekshirilmoqda...</b>",
    
    insufficientCredits: `🚫 <b>Hisobingizda urinishlar qolmadi!</b>

Sizda <code>0</code> ta urinish qoldi. Insho tekshirishda davom etish uchun premium paket xarid qiling.

💳 <b>Premium Paketlar:</b>
• <b>IELTS Express (5 ta urinish)</b>: 25,000 so'm / $2.00 USD
• <b>IELTS Master (15 ta urinish)</b>: 60,000 so'm / $5.00 USD

🔒 <b>To'lov ma'lumotlari (Uzcard/Humo):</b>
• <b>Karta raqami:</b> <code>8600 1234 5678 9012</code>
• <b>Karta egasi:</b> Bot Premium Upgrade

<b>To'lov qilish usuli:</b>
1. Yuqoridagi kartaga to'lovni amalga oshiring.
2. <b>To'lov chekini rasmga/skrinshotga oling</b>.
3. <b>Ushbu xabarga javob (reply)</b> sifatida chek rasmini yuboring!

Rasm qabul qilingandan so'ng, adminimiz kavolatni tekshiradi va hisobingizga urinishlarni qo'shib beradi.`,

    receiptReceived: "✅ <b>Chek qabul qilindi!</b> Sizning to'lov chekingiz tasdiqlash uchun adminga yuborildi. To'lov tasdiqlangach, sizga xabar yuboriladi.",
    
    errorDocx: "❌ Word hujjatini (.docx) o'qib bo'lmadi. Fayl buzilmaganligini tekshiring yoki matn sifatida yuboring.",
    errorPdf: "❌ PDF hujjatini o'qib bo'lmadi. Undagi matn tanlanadigan ekanligiga ishonch hosil qiling yoki matn sifatida yuboring.",
    errorGeneral: "❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring yoki /contact orqali bog'laning.",
    
    paymentApproved: "🎉 <b>Sizning to'lovingiz tasdiqlandi!</b> \nHisobingizga 5 ta urinish qo'shildi. Insholaringizni tekshirishingiz mumkin. Boshlash uchun /check yozing!",
    paymentDenied: "❌ <b>Sizning to'lovingiz tasdiqlanmadi.</b> \nAgar xatolik yuz bergan deb o'ylasangiz, admin bilan bog'laning: @identitynull."
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

Для подтверждения оплаты, по вопросам или предложениям обращайтесь напрямую к администратору:
👤 <b>Админ:</b> @identitynull

Отправьте скриншот чека об оплате в бота или свяжитесь с админом при возникновении трудностей.`,

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

    invalidFile: "⚠️ <b>Неверный формат файла!</b> Пожалуйста, загружайте только документы <code>.pdf</code> или <code>.docx</code> или отправьте текст напрямую.",
    processing: "⏳ <b>Обработка и анализ вашего эссе...</b> \nИИ-экзаменатор оценивает ваше письмо. Пожалуйста, подождите до 30 секунд.",
    processingImage: "📸 <b>Обработка изображения темы и анализ эссе...</b>",
    
    insufficientCredits: `🚫 <b>Закончились доступные попытки!</b>

У вас осталось <code>0</code> доступных проверок. Для продолжения приобретите премиум-пакет.

💳 <b>Премиум-пакеты:</b>
• <b>IELTS Express (5 проверок)</b>: 25,000 сум / $2.00 USD
• <b>IELTS Master (15 проверок)</b>: 60,000 сум / $5.00 USD

🔒 <b>Реквизиты для оплаты (Uzcard/Humo):</b>
• <b>Номер карты:</b> <code>8600 1234 5678 9012</code>
• <b>Получатель:</b> Bot Premium Upgrade

<b>Как оплатить:</b>
1. Переведите сумму на указанную карту.
2. <b>Сделайте скриншот чека</b> об оплате.
3. <b>Отправьте фото чека в ответ (reply) на это сообщение!</b>

После получения фото наш администратор проверит транзакцию и моментально пополнит ваш баланс.`,

    receiptReceived: "✅ <b>Чек получен!</b> Ваш чек отправлен администратору на верификацию. Вы получите уведомление после подтверждения платежа.",
    
    errorDocx: "❌ Не удалось прочитать документ Word (.docx). Проверьте файл или отправьте текст напрямую.",
    errorPdf: "❌ Не удалось прочитать PDF-документ. Убедитесь, что текст в нем выделяется, или скопируйте его напрямую.",
    errorGeneral: "❌ Произошла ошибка. Пожалуйста, попробуйте еще раз или свяжитесь с поддержкой /contact.",
    
    paymentApproved: "🎉 <b>Ваш платеж подтвержден!</b> \nВам начислено 5 проверок эссе. Теперь вы можете оценивать свои эссе. Наберите /check для старта!",
    paymentDenied: "❌ <b>Ваш платеж отклонен.</b> \nЕсли вы считаете это ошибкой, обратитесь к администратору: @identitynull."
  }
};
