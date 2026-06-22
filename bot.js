import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
import fs from 'fs';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Essay from './models/Essay.js';
import { translations } from './translations.js';
import { gradeIeltsEssay } from './openai.js';
import { parsePdf, parseDocx } from './documentParser.js';

dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('FATAL ERROR: TELEGRAM_BOT_TOKEN is not defined in environment variables.');
  process.exit(1);
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Middleware to fetch/create user document in MongoDB
bot.use(async (ctx, next) => {
  if (ctx.callbackQuery) {
    console.log(`[CallbackQuery] User: ${ctx.from?.id} (@${ctx.from?.username}) - Data: ${ctx.callbackQuery.data}`);
  } else if (ctx.message && ctx.message.text) {
    console.log(`[TextMessage] User: ${ctx.from?.id} (@${ctx.from?.username}) - Text: ${ctx.message.text}`);
  }

  if (!ctx.from) return next();
  const userId = String(ctx.from.id);
  const username = ctx.from.username || '';

  try {
    // Find or create user document
    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({
        userId,
        username,
        creditCount: 1, // 1 free credit initially
        currentState: 'START'
      });
      await user.save();
      console.log(`New user registered: ${userId} (@${username})`);
    } else {
      // Keep username updated in DB if they changed it
      if (user.username !== username) {
        user.username = username;
        await user.save();
      }
    }

    // Attach user model to the context state
    ctx.state.user = user;

    // Helper translation function attached directly to context
    ctx.translate = (key, replacements = {}) => {
      const lang = user.selectedLanguage || 'en';
      let text = translations[lang]?.[key] || translations['en']?.[key] || key;
      for (const [k, v] of Object.entries(replacements)) {
        text = text.replace(new RegExp(`{${k}}`, 'g'), v);
      }
      return text;
    };

  } catch (error) {
    console.error('Error in user middleware:', error);
  }

  return next();
});

// Helper: Get Admin Chat ID
async function getAdminChatId() {
  if (process.env.ADMIN_CHAT_ID) {
    return process.env.ADMIN_CHAT_ID;
  }
  try {
    // Fallback: search for owner with username 'identitynull'
    const admin = await User.findOne({ username: 'identitynull' });
    if (admin) {
      return admin.userId;
    }
  } catch (error) {
    console.error('Error finding admin in DB:', error);
  }
  return null;
}

// Helper: Generate unique promo code
function generatePromoCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Helper: Dynamic Main Menu Keyboard (Reply Keyboard)
const getMainMenu = (ctx) => {
  const user = ctx.state.user;
  const buttons = [
    [ctx.translate('btnCheck'), ctx.translate('btnContact')],
    [ctx.translate('btnHelp'), ctx.translate('btnChangeLanguage')],
    [ctx.translate('btnBonus')]
  ];
  
  // Add buy credits button if user has zero credits
  if (user && user.creditCount === 0) {
    buttons.push([ctx.translate('btnBuyCredits')]);
  }
  
  return Markup.keyboard(buttons).resize();
};

// Helpers: Dynamic Inline Keyboards for Main Sections
const getWelcomeInline = (ctx) => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(ctx.translate('btnCheck'), 'cmd_check')],
    [
      Markup.button.callback(ctx.translate('btnBuyCredits'), 'cmd_buy')
    ],
    [
      Markup.button.callback(ctx.translate('btnHelp'), 'cmd_help'),
      Markup.button.callback(ctx.translate('btnContact'), 'cmd_contact')
    ],
    [Markup.button.callback(ctx.translate('btnChangeLanguage'), 'cmd_language')]
  ]);
};

const getHelpInline = (ctx) => {
  return Markup.inlineKeyboard([
    [Markup.button.callback(ctx.translate('btnCheck'), 'cmd_check')],
    [Markup.button.callback(ctx.translate('btnContact'), 'cmd_contact')]
  ]);
};



// Helper: Safely sends long HTML messages by splitting them
async function sendLongMessage(ctx, text, options = {}) {
  const LIMIT = 4000;

  const sendChunk = async (chunk, isLast = false) => {
    try {
      const chunkOptions = isLast ? options : { ...options };
      if (!isLast && chunkOptions.reply_markup) {
        delete chunkOptions.reply_markup;
      }
      return await ctx.reply(chunk, chunkOptions);
    } catch (error) {
      // Fallback if HTML/Markdown parsing fails (e.g. unescaped entities)
      if ((options.parse_mode === 'Markdown' || options.parse_mode === 'HTML') && error.message.includes('parse')) {
        console.warn('Failed to parse formatted text, falling back to plain text.');
        const fallbackOptions = isLast ? { ...options } : { ...options };
        if (!isLast && fallbackOptions.reply_markup) {
          delete fallbackOptions.reply_markup;
        }
        delete fallbackOptions.parse_mode;
        return await ctx.reply(chunk, fallbackOptions);
      }
      throw error;
    }
  };

  if (text.length <= LIMIT) {
    return sendChunk(text, true);
  }

  const lines = text.split('\n');
  let currentChunk = '';
  let lastMessage = null;

  for (const line of lines) {
    if (currentChunk.length + line.length + 1 > LIMIT) {
      lastMessage = await sendChunk(currentChunk, false);
      currentChunk = line;
    } else {
      currentChunk += (currentChunk ? '\n' : '') + line;
    }
  }

  if (currentChunk) {
    lastMessage = await sendChunk(currentChunk, true);
  }
  return lastMessage;
}

// --- COMMAND & HANDLER LOGIC ---

async function handleStartCommand(ctx) {
  const user = ctx.state.user;
  user.currentState = 'START';
  user.tempQuestionText = null;
  user.tempQuestionPhotoId = null;
  await user.save();

  if (ctx.callbackQuery) {
    try { await ctx.answerCbQuery(); } catch (e) {}
  }

  if (!user.selectedLanguage) {
    return ctx.reply(
      "🇺🇿 Iltimos, tilni tanlang.\n🇷🇺 Пожалуйста, выберите язык.\n🇬🇧 Please select your language.",
      Markup.inlineKeyboard([
        [Markup.button.callback('🇺🇿 O\'zbekcha', 'lang_uz')],
        [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
        [Markup.button.callback('🇬🇧 English', 'lang_en')]
      ])
    );
  }

  // Load the reply menu keyboard to keep it active
  await ctx.reply(ctx.translate('menuUpdated'), getMainMenu(ctx));

  // Welcome user without inline keyboard
  return ctx.reply(ctx.translate('welcome', { credits: user.creditCount }), {
    parse_mode: 'HTML'
  });
}

async function handleCheckCommand(ctx) {
  const user = ctx.state.user;

  if (ctx.callbackQuery) {
    try { await ctx.answerCbQuery(); } catch (e) {}
  }

  if (user.creditCount < 1) {
    user.currentState = 'AWAITING_RECEIPT';
    await user.save();

    await ctx.reply(ctx.translate('menuUpdated'), getMainMenu(ctx));
    return ctx.reply(ctx.translate('insufficientCredits', { credits: user.creditCount }), {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback(ctx.translate('btnBuyCredits'), 'cmd_buy')]
      ])
    });
  }

  user.currentState = 'AWAITING_QUESTION';
  user.tempQuestionText = null;
  user.tempQuestionPhotoId = null;
  await user.save();

  await ctx.reply(ctx.translate('menuUpdated'), getMainMenu(ctx));

  return ctx.reply(ctx.translate('promptQuestion'), {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [Markup.button.callback(ctx.translate('btnSkipQuestion'), 'skip_question')],
      [Markup.button.callback('❌ Cancel', 'cancel_check')]
    ])
  });
}


async function handleHelpCommand(ctx) {
  const user = ctx.state.user;
  user.currentState = 'START';
  await user.save();

  if (ctx.callbackQuery) {
    try { await ctx.answerCbQuery(); } catch (e) {}
  }

  await ctx.reply(ctx.translate('menuUpdated'), getMainMenu(ctx));

  return ctx.reply(ctx.translate('help'), {
    parse_mode: 'HTML',
    ...getHelpInline(ctx)
  });
}

async function handleContactCommand(ctx) {
  const user = ctx.state.user;
  user.currentState = 'START';
  await user.save();

  if (ctx.callbackQuery) {
    try { await ctx.answerCbQuery(); } catch (e) {}
  }

  await ctx.reply(ctx.translate('menuUpdated'), getMainMenu(ctx));

  return ctx.reply(ctx.translate('contact'), {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [Markup.button.url(ctx.translate('btnContactDirectly'), 'https://t.me/+BMjBYcW4_oNjNjNi')]
    ])
  });
}

async function handleBonusCommand(ctx) {
  const user = ctx.state.user;
  user.currentState = 'START';
  await user.save();

  if (ctx.callbackQuery) {
    try { await ctx.answerCbQuery(); } catch (e) {}
  }

  await ctx.reply(ctx.translate('menuUpdated'), getMainMenu(ctx));

  try {
    // Prepare caption with progress info
    const sharedCount = user.promoCodeCount || 0;
    const progressText = `\n\n📊 <b>Your Progress:</b> You have shared: <b>${sharedCount}/5</b>`;
    
    const caption = ctx.translate('bonusInstructions') + progressText;

    // Send image with caption and buttons
    return ctx.replyWithPhoto(
      { source: fs.createReadStream('./assets/bonus-program.png') },
      {
        caption: caption,
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [Markup.button.callback(ctx.translate('btnGetPromoCode'), 'get_promo_code')],
          [Markup.button.callback(ctx.translate('btnEnterPromoCode'), 'enter_promo_code')]
        ])
      }
    );
  } catch (error) {
    console.error('Error sending bonus image:', error);
    // Fallback to text message if image fails
    return ctx.reply(ctx.translate('bonusInstructions'), {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback(ctx.translate('btnGetPromoCode'), 'get_promo_code')],
        [Markup.button.callback(ctx.translate('btnEnterPromoCode'), 'enter_promo_code')]
      ])
    });
  }
}

async function handleCreditsCommand(ctx) {
  const user = ctx.state.user;
  user.currentState = 'AWAITING_RECEIPT';
  await user.save();

  if (ctx.callbackQuery) {
    try { await ctx.answerCbQuery(); } catch (e) {}
  }

  await ctx.reply(ctx.translate('menuUpdated'), getMainMenu(ctx));

  return ctx.reply(ctx.translate('buyCreditsInfo'), {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [Markup.button.callback(ctx.translate('btnBuyCredits'), 'cmd_buy')]
    ])
  });
}

// Bind Command Routes
bot.command('start', handleStartCommand);
bot.command('check', handleCheckCommand);
bot.command('help', handleHelpCommand);
bot.command('contact', handleContactCommand);
bot.command('bonus', handleBonusCommand);
bot.command('credits', handleCreditsCommand);
bot.command('language', async (ctx) => {
  const user = ctx.state.user;
  user.currentState = 'START';
  await user.save();
  return ctx.reply(
    "🇺🇿 Iltimos, tilni tanlang.\n🇷🇺 Пожалуйста, выберите язык.\n🇬🇧 Please select your language.",
    Markup.inlineKeyboard([
      [Markup.button.callback('🇺🇿 O\'zbekcha', 'lang_uz')],
      [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
      [Markup.button.callback('🇬🇧 English', 'lang_en')]
    ])
  );
});
bot.command('commands', async (ctx) => {
  const user = ctx.state.user;
  user.currentState = 'START';
  await user.save();
  
  await ctx.reply(ctx.translate('menuUpdated'), getMainMenu(ctx));
  return ctx.reply(ctx.translate('commandsList'), {
    parse_mode: 'HTML',
    ...getWelcomeInline(ctx)
  });
});

// --- CALLBACK ACTIONS ---

// Language Callback Actions
const handleLangSelection = async (ctx, lang) => {
  const user = ctx.state.user;
  user.selectedLanguage = lang;
  user.currentState = 'START';
  await user.save();

  try { await ctx.answerCbQuery(); } catch (e) {}
  await ctx.reply(ctx.translate('languageSelected'));

  // Open the reply menu keyboard
  await ctx.reply(ctx.translate('menuUpdated'), getMainMenu(ctx));

  // Welcome user with inline keyboard
  return ctx.reply(ctx.translate('welcome', { credits: user.creditCount }), {
    parse_mode: 'HTML',
    ...getWelcomeInline(ctx)
  });
};

bot.action('lang_uz', (ctx) => handleLangSelection(ctx, 'uz'));
bot.action('lang_ru', (ctx) => handleLangSelection(ctx, 'ru'));
bot.action('lang_en', (ctx) => handleLangSelection(ctx, 'en'));

// Section Callback Actions
bot.action('cmd_check', handleCheckCommand);
bot.action('cmd_help', handleHelpCommand);
bot.action('cmd_contact', handleContactCommand);
bot.action('cmd_language', async (ctx) => {
  try { await ctx.answerCbQuery(); } catch (e) {}
  return ctx.reply(
    "🇺🇿 Iltimos, tilni tanlang.\n🇷🇺 Пожалуйста, выберите язык.\n🇬🇧 Please select your language.",
    Markup.inlineKeyboard([
      [Markup.button.callback('🇺🇿 O\'zbekcha', 'lang_uz')],
      [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
      [Markup.button.callback('🇬🇧 English', 'lang_en')]
    ])
  );
});
bot.action('cmd_buy', async (ctx) => {
  try { await ctx.answerCbQuery(); } catch (e) {}
  const user = ctx.state.user;
  user.currentState = 'AWAITING_RECEIPT';
  await user.save();

  await ctx.reply(ctx.translate('menuUpdated'), getMainMenu(ctx));
  return ctx.reply(ctx.translate('insufficientCredits', { credits: user.creditCount }), {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('✅ Already Paid', 'already_paid')]
    ])
  });
});

bot.action('already_paid', async (ctx) => {
  try { await ctx.answerCbQuery(); } catch (e) {}
  const user = ctx.state.user;
  user.currentState = 'AWAITING_RECEIPT';
  await user.save();

  return ctx.reply(ctx.translate('alreadyPaidPrompt'), {
    parse_mode: 'HTML'
  });
});

// Bonus Promo Code Callback Actions
bot.action('get_promo_code', async (ctx) => {
  try { await ctx.answerCbQuery(); } catch (e) {}
  const user = ctx.state.user;

  if (!user.promoCode) {
    user.promoCode = generatePromoCode();
    await user.save();
  }

  return ctx.reply(ctx.translate('promoCodeGenerated', {
    promoCode: user.promoCode,
    count: user.promoCodeCount
  }), {
    parse_mode: 'HTML'
  });
});

bot.action('enter_promo_code', async (ctx) => {
  try { await ctx.answerCbQuery(); } catch (e) {}
  const user = ctx.state.user;

  if (user.usedPromoCode) {
    return ctx.reply(ctx.translate('promoCodeAlreadyUsed'), {
      parse_mode: 'HTML'
    });
  }

  user.currentState = 'AWAITING_PROMO_CODE';
  await user.save();

  return ctx.reply(ctx.translate('enterPromoCodePrompt'), {
    parse_mode: 'HTML'
  });
});

// Question Skipping Callback Action
bot.action('skip_question', async (ctx) => {
  const user = ctx.state.user;

  if (user.currentState !== 'AWAITING_QUESTION') {
    return ctx.answerCbQuery('Not in question selection state.');
  }

  user.tempQuestionText = null;
  user.tempQuestionPhotoId = null;
  user.currentState = 'AWAITING_ESSAY';
  await user.save();

  try { await ctx.answerCbQuery(); } catch (e) {}

  // Try to edit the message to reflect that question phase is completed/skipped
  try {
    await ctx.editMessageText(ctx.translate('questionSkipped'), { parse_mode: 'HTML' });
  } catch (err) {
    console.error('Failed to edit skip question message:', err.message);
  }

  return ctx.reply(ctx.translate('promptEssay'), {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('❌ Cancel', 'cancel_check')]
    ])
  });
});

// Cancel Check Callback Action
bot.action('cancel_check', async (ctx) => {
  const user = ctx.state.user;
  user.currentState = 'START';
  user.tempQuestionText = null;
  user.tempQuestionPhotoId = null;
  await user.save();

  try { await ctx.answerCbQuery('Check cancelled.'); } catch (e) {}

  return ctx.reply(ctx.translate('checkCancelled'), {
    parse_mode: 'HTML',
    ...getMainMenu(ctx)
  });
});

// --- STATE MANAGEMENT AND MESSAGE ROUTING ---

// Text Message Route
bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  const user = ctx.state.user;

  // 1. Check for localized menu button clicks
  if (text === translations.en.btnCheck || text === translations.uz.btnCheck || text === translations.ru.btnCheck) {
    return handleCheckCommand(ctx);
  }
  if (text === translations.en.btnHelp || text === translations.uz.btnHelp || text === translations.ru.btnHelp) {
    return handleHelpCommand(ctx);
  }
  if (text === translations.en.btnContact || text === translations.uz.btnContact || text === translations.ru.btnContact) {
    return handleContactCommand(ctx);
  }
  if (text === translations.en.btnBonus || text === translations.uz.btnBonus || text === translations.ru.btnBonus) {
    return handleBonusCommand(ctx);
  }
  if (text === translations.en.btnBuyCredits || text === translations.uz.btnBuyCredits || text === translations.ru.btnBuyCredits) {
    return handleCreditsCommand(ctx);
  }
  if (text === translations.en.btnChangeLanguage || text === translations.uz.btnChangeLanguage || text === translations.ru.btnChangeLanguage) {
    user.currentState = 'START';
    await user.save();
    return ctx.reply(
      "🇺🇿 Iltimos, tilni tanlang.\n🇷🇺 Пожалуйста, выберите язык.\n🇬🇧 Please select your language.",
      Markup.inlineKeyboard([
        [Markup.button.callback('🇺🇿 O\'zbekcha', 'lang_uz')],
        [Markup.button.callback('🇷🇺 Русский', 'lang_ru')],
        [Markup.button.callback('🇬🇧 English', 'lang_en')]
      ])
    );
  }

  // 2. Handle text input based on the state machine
  if (user.currentState === 'AWAITING_QUESTION') {
    user.tempQuestionText = text;
    user.tempQuestionPhotoId = null;
    user.currentState = 'AWAITING_ESSAY';
    await user.save();

    return ctx.reply(ctx.translate('promptEssay'), {
      parse_mode: 'HTML',
      ...getMainMenu(ctx)
    });
  }

  if (user.currentState === 'AWAITING_ESSAY') {
    if (text.trim().split(/\s+/).length < 20) {
      return ctx.reply("⚠️ Your essay is too short. Please submit a complete IELTS writing essay (e.g. > 100 words).");
    }
    return processEssayGrading(ctx, text);
  }

  if (user.currentState === 'AWAITING_PROMO_CODE') {
    const promoCode = text.trim().toUpperCase();

    try {
      const promoUser = await User.findOne({ promoCode: promoCode });

      if (!promoUser) {
        return ctx.reply(ctx.translate('promoCodeInvalid'), {
          parse_mode: 'HTML',
          ...getMainMenu(ctx)
        });
      }

      // Mark promo code as used
      user.usedPromoCode = promoCode;
      // Only set discount if the promo user already has 5 referrals
      if (promoUser.promoCodeCount >= 5) {
        user.receivedBonusDiscount = true;
      }
      user.currentState = 'START';
      await user.save();

      // Increment promo code usage count for the original user
      promoUser.promoCodeCount += 1;
      await promoUser.save();

      // Notify the original user with appropriate message
      try {
        let notificationMessage;
        
        if (promoUser.promoCodeCount === 5) {
          // Show bonus unlocked message with celebration when reaching exactly 5
          notificationMessage = ctx.translate('promoCodeFull');
          
          // Send celebration animation
          try {
            await ctx.telegram.sendDice(promoUser.userId, '🎉');
          } catch (e) {
            // Ignore if dice fails
          }
        } else {
          // Show progress message
          const remaining = 5 - promoUser.promoCodeCount;
          const progressMessage = `${remaining === 0 ? '✅ All 5 referrals completed!' : `You have ${promoUser.promoCodeCount}/5 people. You need ${remaining} more to unlock the bonus!`}`;
          notificationMessage = ctx.translate('promoCodeUsed', {
            count: promoUser.promoCodeCount,
            progressMessage: progressMessage
          });
        }

        await ctx.telegram.sendMessage(promoUser.userId, notificationMessage, {
          parse_mode: 'HTML'
        });
      } catch (err) {
        console.error(`Could not notify promo user ${promoUser.userId}:`, err.message);
      }

      await ctx.reply(ctx.translate('promoCodeSuccess'), {
        parse_mode: 'HTML',
        ...getMainMenu(ctx)
      });

      return;
    } catch (error) {
      console.error('Error processing promo code:', error);
      return ctx.reply(ctx.translate('errorGeneral'), {
        parse_mode: 'HTML',
        ...getMainMenu(ctx)
      });
    }
  }

  if (user.currentState === 'AWAITING_RECEIPT') {
    // Re-prompt payment manual guidelines
    return ctx.reply(ctx.translate('insufficientCredits'), {
      parse_mode: 'HTML',
      ...getMainMenu(ctx)
    });
  }

  // Fallback response for unhandled text
  return ctx.reply(ctx.translate('welcome', { credits: user.creditCount }), {
    parse_mode: 'HTML',
    ...getWelcomeInline(ctx)
  });
});

// Photo Message Route
bot.on('photo', async (ctx) => {
  const user = ctx.state.user;
  const photo = ctx.message.photo[ctx.message.photo.length - 1];

  if (user.currentState === 'AWAITING_QUESTION') {
    user.tempQuestionPhotoId = photo.file_id;
    user.tempQuestionText = null;
    user.currentState = 'AWAITING_ESSAY';
    await user.save();

    return ctx.reply(ctx.translate('promptEssay'), {
      parse_mode: 'HTML',
      ...getMainMenu(ctx)
    });
  }

  if (user.currentState === 'AWAITING_RECEIPT' || user.creditCount === 0) {
    return handleReceiptPhoto(ctx, photo.file_id);
  }

  return ctx.reply(ctx.translate('help'), {
    parse_mode: 'HTML',
    ...getHelpInline(ctx)
  });
});

// Document/File Message Route
bot.on('document', async (ctx) => {
  const user = ctx.state.user;

  if (user.currentState !== 'AWAITING_ESSAY') {
    return ctx.reply(ctx.translate('help'), {
      parse_mode: 'HTML',
      ...getHelpInline(ctx)
    });
  }

  const doc = ctx.message.document;
  const fileName = doc.file_name || '';
  const isPdf = fileName.toLowerCase().endsWith('.pdf');
  const isDocx = fileName.toLowerCase().endsWith('.docx');

  if (!isPdf && !isDocx) {
    return ctx.reply(ctx.translate('invalidFile'), { parse_mode: 'HTML' });
  }

  const loadingMsg = await ctx.reply("📥 Downloading and parsing document...", { parse_mode: 'HTML' });

  try {
    const fileLink = await ctx.telegram.getFileLink(doc.file_id);
    const response = await fetch(fileLink.href);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';
    if (isPdf) {
      extractedText = await parsePdf(buffer);
    } else {
      extractedText = await parseDocx(buffer);
    }

    try {
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
    } catch (e) {}

    if (!extractedText || extractedText.trim().split(/\s+/).length < 20) {
      return ctx.reply("⚠️ Extracted text from document is too short or blank. Please check the document or copy-paste the text directly.");
    }

    return processEssayGrading(ctx, extractedText);

  } catch (error) {
    console.error('Error parsing document:', error);
    try {
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
    } catch (e) {}

    const errKey = isPdf ? 'errorPdf' : 'errorDocx';
    return ctx.reply(ctx.translate(errKey), { parse_mode: 'HTML' });
  }
});

// --- CORE LOGIC IMPLEMENTATIONS ---

// Process the grading via Google Gemini
async function processEssayGrading(ctx, essayText) {
  const user = ctx.state.user;

  if (user.creditCount < 1) {
    user.currentState = 'AWAITING_RECEIPT';
    await user.save();
    return ctx.reply(ctx.translate('insufficientCredits'), {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback(ctx.translate('btnBuyCredits'), 'cmd_buy')]
      ])
    });
  }

  const hasPhotoQuestion = !!user.tempQuestionPhotoId;
  const processingText = hasPhotoQuestion ? ctx.translate('processingImage') : ctx.translate('processing');
  const loadingMsg = await ctx.reply(processingText, { parse_mode: 'HTML' });

  try {
    let questionImageBase64 = null;
    let questionImageMimeType = null;

    // Convert question photo to base64 if available
    if (hasPhotoQuestion) {
      const fileLink = await ctx.telegram.getFileLink(user.tempQuestionPhotoId);
      const response = await fetch(fileLink.href);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      questionImageBase64 = buffer.toString('base64');
      questionImageMimeType = 'image/jpeg';
    }

    // Invoke Gemini API grading call
    const feedbackReport = await gradeIeltsEssay(
      user.tempQuestionText,
      essayText,
      questionImageBase64,
      questionImageMimeType,
      user.selectedLanguage || 'en'
    );

    // Deduct credit and reset state ONLY after a successful grading
    user.creditCount = Math.max(0, user.creditCount - 1);
    user.essaysCount = (user.essaysCount || 0) + 1;
    user.currentState = 'START';
    user.tempQuestionText = null;
    user.tempQuestionPhotoId = null;
    await user.save();

    // Save essay record for admin panel
    try {
      const wordCount = essayText.split(/\s+/).filter(Boolean).length;
      const essay = new Essay({
        userId: user.userId,
        questionText: user.tempQuestionText || null,
        essayText: essayText.substring(0, 50000),
        source: hasPhotoQuestion ? 'image' : 'text',
        wordCount,
        geminiReport: feedbackReport,
        language: user.selectedLanguage || 'en',
        processingTime: Date.now() - loadingMsg.date * 1000
      });
      await essay.save();
    } catch (essayError) {
      console.error('Error saving essay record:', essayError);
    }

    // Delete temporary loading message
    try {
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
    } catch (e) {}

    // Send result feedback safely
    await sendLongMessage(ctx, feedbackReport, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(ctx.translate('btnCheck'), 'cmd_check'),
          Markup.button.callback(ctx.translate('btnBuyCredits'), 'cmd_buy')
        ]
      ])
    });

  } catch (error) {
    console.error('Error during essay grading flow:', error);
    try {
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
    } catch (e) {}

    return ctx.reply(ctx.translate('errorGeneral'), {
      parse_mode: 'HTML',
      ...getMainMenu(ctx)
    });
  }
}

// Handle forwarding receipt to Payment Channel
async function handleReceiptPhoto(ctx, fileId) {
  const user = ctx.state.user;
  const paymentChannelId = process.env.PAYMENT_CHANNEL_ID;

  if (!paymentChannelId) {
    console.error('PAYMENT_CHANNEL_ID is not set in environment variables.');
    return ctx.reply('❌ Payment system is not configured. Please contact admin.', {
      parse_mode: 'HTML',
      ...getMainMenu(ctx)
    });
  }

  // Create keyboard with inline approval buttons containing target user's ID
  const adminMarkup = Markup.inlineKeyboard([
    [
      Markup.button.callback('✅ Approve Payment', `approve_pay_${user.userId}`),
      Markup.button.callback('❌ Deny Payment', `deny_pay_${user.userId}`)
    ]
  ]);

  const captionText = ctx.translate('adminReceiptNotify', {
    username: user.username || 'NoUsername',
    userId: user.userId,
    language: user.selectedLanguage || 'en'
  });

  try {
    // Send photo to payment channel
    await ctx.telegram.sendPhoto(paymentChannelId, fileId, {
      caption: captionText,
      parse_mode: 'HTML',
      ...adminMarkup
    });

    // Reset user state to normal
    user.currentState = 'START';
    await user.save();

    return ctx.reply(ctx.translate('receiptReceived'), {
      parse_mode: 'HTML',
      ...getMainMenu(ctx)
    });

  } catch (error) {
    console.error('Failed to send payment receipt to channel:', error);
    return ctx.reply(ctx.translate('errorGeneral'), {
      parse_mode: 'HTML',
      ...getMainMenu(ctx)
    });
  }
}

// --- ADMIN CALLBACK ACTIONS ---

// Approve Payment Callback
bot.action(/^approve_pay_(.+)$/, async (ctx) => {
  const targetUserId = ctx.match[1];

  try {
    const targetUser = await User.findOne({ userId: targetUserId });
    if (!targetUser) {
      return ctx.answerCbQuery('User not found in database.');
    }

    targetUser.creditCount += 10; // Give 10 credits on approval
    targetUser.currentState = 'START';
    await targetUser.save();

    // Helper translator for the target user's language settings
    const translateForUser = (key) => {
      const lang = targetUser.selectedLanguage || 'en';
      return translations[lang]?.[key] || translations['en']?.[key] || key;
    };

    // Notify user in their chosen language
    try {
      await ctx.telegram.sendMessage(targetUserId, translateForUser('paymentApproved'), {
        parse_mode: 'HTML'
      });
    } catch (err) {
      console.error(`Could not notify user ${targetUserId}:`, err.message);
    }

    // Update Admin's view
    const originalCaption = ctx.callbackQuery.message.caption || '';
    const bonusStatus = targetUser.receivedBonusDiscount ? ' (Bonus Discount: 15,000)' : ' (Regular: 25,000)';
    await ctx.editMessageCaption(
      `${originalCaption}\n\n✅ <b>Status: APPROVED (+10 Credits${bonusStatus})</b>`,
      {
        parse_mode: 'HTML',
        reply_markup: null // remove inline buttons
      }
    );

    return ctx.answerCbQuery('Payment approved, 10 credits added.');

  } catch (error) {
    console.error('Error handling payment approval:', error);
    return ctx.answerCbQuery('Approval processing error.');
  }
});

// Deny Payment Callback
bot.action(/^deny_pay_(.+)$/, async (ctx) => {
  const targetUserId = ctx.match[1];

  try {
    const targetUser = await User.findOne({ userId: targetUserId });
    if (!targetUser) {
      return ctx.answerCbQuery('User not found.');
    }

    const translateForUser = (key) => {
      const lang = targetUser.selectedLanguage || 'en';
      return translations[lang]?.[key] || translations['en']?.[key] || key;
    };

    // Notify user of denial
    try {
      await ctx.telegram.sendMessage(targetUserId, translateForUser('paymentDenied'), {
        parse_mode: 'HTML'
      });
    } catch (err) {
      console.error(`Could not notify user ${targetUserId}:`, err.message);
    }

    // Update Admin's view
    const originalCaption = ctx.callbackQuery.message.caption || '';
    await ctx.editMessageCaption(
      `${originalCaption}\n\n❌ <b>Status: DENIED</b>`,
      {
        parse_mode: 'HTML',
        reply_markup: null // remove inline buttons
      }
    );

    return ctx.answerCbQuery('Payment denied.');

  } catch (error) {
    console.error('Error handling payment denial:', error);
    return ctx.answerCbQuery('Denial processing error.');
  }
});

// --- STARTUP LOGIC ---

export default bot;

async function startBot() {
  try {
    await connectDB();
    
    // Stop any existing bot instance first
    try {
      await bot.stop();
    } catch (e) {
      // Ignore errors if bot isn't running
    }
    
    // Wait a bit before restarting to avoid conflict
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await bot.launch();
    console.log('------------------------------------------------');
    console.log('🤖 IELTS AI Essay Grader Telegram Bot is online!');
    console.log('------------------------------------------------');
  } catch (error) {
    console.error('Startup failed:', error);
    // Don't exit immediately, try to recover
    setTimeout(() => {
      console.log('Attempting to restart bot...');
      startBot();
    }, 5000);
  }
}

startBot();

// Graceful shutdowns
process.once('SIGINT', () => {
  console.log('Shutting down...');
  bot.stop('SIGINT');
  process.exit(0);
});
process.once('SIGTERM', () => {
  console.log('Shutting down...');
  bot.stop('SIGTERM');
  process.exit(0);
});
