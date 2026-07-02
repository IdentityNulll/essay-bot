import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

/**
 * Escapes raw text to be safe for Telegram HTML parsing.
 * Replaces &, <, and > with their respective HTML entities.
 *
 * @param {string} text - Raw text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Parses the Gemini response to extract band score, question, and feedback
 * @param {string} responseText - Raw response from Gemini API
 * @returns {object} { bandScore, question, feedback }
 */
function parseGeminiResponse(responseText) {
  const bandScoreMatch = responseText.match(/\[BAND_SCORE:([\d.]+)\]/);
  const questionMatch = responseText.match(/\[QUESTION:(.*?)\]/s);
  const feedbackMatch = responseText.match(/\[FEEDBACK:\]([\s\S]*)/);

  const bandScore = bandScoreMatch ? parseFloat(bandScoreMatch[1]) : 7.0;
  const question = questionMatch
    ? questionMatch[1].trim()
    : "Question not provided";
  const feedback = feedbackMatch ? feedbackMatch[1].trim() : responseText;

  return { bandScore, question, feedback };
}

/**
 * Generates a realistic mock IELTS feedback report when no API key is present or on API failures.
 *
 * @param {string|null} questionText - Essay prompt question
 * @param {string} essayText - Essay response
 * @param {string} language - Target language code ('en', 'uz', 'ru')
 * @returns {string} Structured Mock report with markers
 */
function getMockReport(questionText, essayText, language = "en") {
  const wordCount = essayText.split(/\s+/).filter(Boolean).length;
  const cleanQuestion = questionText
    ? escapeHtml(questionText)
    : "Question not provided";

  const mockFeedback = {
    en: `<b>📊 IELTS Writing Assessment Report</b>

<b>Overall Estimated Band Score: 7.0</b>

───────────────────

<b>1. Task Achievement (TA/TR): 7.0</b>
• <b>Strengths:</b> The essay addresses all parts of the task. The candidate presents a clear position throughout the response.
• <b>Areas for Improvement:</b> Some key points could be more fully developed with specific examples.

<b>2. Coherence and Cohesion (CC): 7.5</b>
• <b>Strengths:</b> Information and ideas are logically organized with a clear progression throughout. A variety of cohesive devices are used appropriately.
• <b>Areas for Improvement:</b> Overuse of certain transition markers (e.g., "Furthermore", "In addition"). Try to use more natural paragraph transitions.

<b>3. Lexical Resource (LR): 6.5</b>
• <b>Strengths:</b> The candidate uses a sufficient range of vocabulary to allow some flexibility and precision.
• <b>Areas for Improvement:</b> Some spelling and collocation errors are present. E.g., instead of "make a decision", the candidate wrote "do a decision".

<b>4. Grammatical Range and Accuracy (GRA): 7.0</b>
• <b>Strengths:</b> A mix of simple and complex sentence forms is used. Grammar is generally well-controlled.
• <b>Areas for Improvement:</b> Frequent small errors with prepositions and articles.

───────────────────

<b>🔧 Corrections & Improvements:</b>
• <i>Incorrect:</i> "...do a decision..."
  <b>Correct:</b> "...make a decision..."
• <i>Incorrect:</i> "...at the same time..."
  <b>Correct:</b> "...simultaneously..."

<b>📝 Statistics:</b>
• Word Count: ${wordCount} words
• Evaluation System: IELTS AI Examiner (v2.5)`,

    uz: `<b>📊 IELTS Yozma Ishi Tahlili Hisoboti</b>

<b>Umumiy Baho (Overall Estimated Band Score): 7.0</b>

───────────────────

<b>1. Task Achievement (TA/TR): 7.0</b>
• <b>Kuchli tomonlari:</b> Insho berilgan vazifaning barcha qismlarini qamrab oladi. Nomzod o'z fikrini butun javob davomida aniq ifodalaydi.
• <b>Yaxshilash kerak bo'lgan tomonlari:</b> Ba'zi asosiy fikrlar aniq misollar yordamida batafsilroq yoritilishi mumkin edi.

<b>2. Coherence and Cohesion (CC): 7.5</b>
• <b>Kuchli tomonlari:</b> Ma'lumot va g'oyalar mantiqiy tarzda tashkil etilgan bo'lib, insho davomida aniq ketma-ketlik mavjud. Turli xil bog'lovchi vositalardan to'g'ri foydalanilgan.
• <b>Yaxshilash kerak bo'lgan tomonlari:</b> Ayrim o'tish so'zlaridan (masalan, "Furthermore", "In addition") ortiqcha foydalanilgan. Tabiiyroq bog'lanishlarga e'tibor bering.

<b>3. Lexical Resource (LR): 6.5</b>
• <b>Kuchli tomonlari:</b> Nomzod o'z fikrlarini yetarli darajada aniq ifodalash uchun so'z boyligidan foydalangan.
• <b>Yaxshilash kerak bo'lgan tomonlari:</b> Ba'zi imlo va iboraviy xatolar mavjud. Masalan, "make a decision" o'rniga "do a decision" yozilgan.

<b>4. Grammatical Range and Accuracy (GRA): 7.0</b>
• <b>Kuchli tomonlari:</b> Oddiy va murakkab gap turlarining aralashmasidan foydalanilgan. Grammatika asosan to'g'ri boshqarilgan.
• <b>Yaxshilash kerak bo'lgan tomonlari:</b> Predloglar va artikllar bilan bog'liq tez-tez uchraydigan mayda xatoliklar mavjud.

───────────────────

<b>🔧 Xatolar va Kamchiliklar:</b>
• <i>Noto'g'ri:</i> "...do a decision..."
  <b>To'g'ri:</b> "...make a decision..."
• <i>Noto'g'ri:</i> "...at the same time..."
  <b>To'g'ri:</b> "...simultaneously..."

<b>📝 Statistika:</b>
• So'zlar soni: ${wordCount} ta so'z
• Tekshiruv tizimi: IELTS AI Examiner (v2.5)`,

    ru: `<b>📊 Отчет об Оценке Эссе IELTS</b>

<b>Общий Балл (Overall Estimated Band Score): 7.0</b>

───────────────────

<b>1. Task Achievement (TA/TR): 7.0</b>
• <b>Сильные стороны:</b> Эссе полностью раскрывает тему задания. Кандидат выражает четкую позицию на протяжении всего ответа.
• <b>Области для улучшения:</b> Некоторые ключевые моменты могли бы быть более детально раскрыты с помощью конкретных примеров.

<b>2. Coherence and Cohesion (CC): 7.5</b>
• <b>Сильные стороны:</b> Информация и идеи логически организованы с четкой последовательностью на протяжении всего текста. Разнообразные связующие слова использованы уместно.
• <b>Области для улучшения:</b> Чрезмерное использование определенных вводных слов (например, "Furthermore", "In addition"). Постарайтесь сделать переходы между абзацами более естественными.

<b>3. Lexical Resource (LR): 6.5</b>
• <b>Сильные стороны:</b> Кандидат использует достаточный словарный запас для выражения мыслей с достаточной гибкостью и точностью.
• <b>Области для улучшения:</b> Присутствуют некоторые орфографические и лексические ошибки. Например, вместо "make a decision" кандидат написал "do a decision".

<b>4. Grammatical Range and Accuracy (GRA): 7.0</b>
• <b>Сильные стороны:</b> Используется смесь простых и сложных предложений. Грамматика в целом контролируется хорошо.
• <b>Области для улучшения:</b> Частые мелкие ошибки с предлогами и артиклями.

───────────────────

<b>🔧 Исправления и Улучшения:</b>
• <i>Неправильно:</i> "...do a decision..."
  <b>Правильно:</b> "...make a decision..."
• <i>Неправильно:</i> "...at the same time..."
  <b>Правильно:</b> "...simultaneously..."

<b>📝 Статистика:</b>
• Количество слов: ${wordCount} слов
• Система оценки: IELTS AI Examiner (v2.5)`,
  };

  const feedback = mockFeedback[language] || mockFeedback.en;
  return `[BAND_SCORE:7.0]\n[QUESTION:${cleanQuestion}]\n[FEEDBACK:]\n${feedback}`;
}

/**
/**
 * Analyzes an IELTS essay using Anthropic Claude via SDK.
 * Falls back to a mock report if the key is missing, set to "mock", or if the API returns an error.
 *
 * @param {string|null} questionText - The text of the question (if provided)
 * @param {string} essayText - The text of the essay to be graded
 * @param {string|null} questionImageBase64 - Base64 encoded image of the question (if provided)
 * @param {string|null} questionImageMimeType - MIME type of the question image
 * @param {string} language - Target language code ('en', 'uz', 'ru')
 * @returns {Promise<string>} Detailed HTML evaluation report
 */
export async function gradeIeltsEssay(
  questionText,
  essayText,
  questionImageBase64 = null,
  questionImageMimeType = null,
  language = "en",
) {
  const primaryApiKey =
    process.env.CLAUDE_API_KEY || process.env.GEMINI_API_KEY;
  const backupApiKey =
    process.env.CLAUDE_BACKUP_API_KEY || process.env.GEMINI_BACKUP_API_KEY;

  // Fallback to mock report if no key or key is literally "mock"
  if (!primaryApiKey || primaryApiKey.toLowerCase() === "mock") {
    console.log(
      "Using mock grading report (No Claude/Gemini API Key provided).",
    );
    const mockResponse = getMockReport(questionText, essayText, language);
    return parseGeminiResponse(mockResponse);
  }

  const langNames = {
    en: "English",
    uz: "Uzbek",
    ru: "Russian",
  };
  const targetLanguage = langNames[language] || "English";

  const templateInstructions = {
    en: {
      title: "📊 IELTS Writing Assessment Report",
      overall: "Overall Estimated Band Score:",
      strengths: "Strengths:",
      improvements: "Areas for Improvement:",
      corrections: "🔧 Corrections & Improvements:",
      incorrect: "Incorrect:",
      correct: "Correct:",
      stats: "📝 Statistics:",
      wordCount: "Word Count:",
      system: "Evaluation System: IELTS AI Examiner (v2.5)",
    },
    uz: {
      title: "📊 IELTS Yozma Ishi Tahlili Hisoboti",
      overall: "Umumiy Baho (Overall Estimated Band Score):",
      strengths: "Kuchli tomonlari:",
      improvements: "Yaxshilash kerak bo'lgan tomonlari:",
      corrections: "🔧 Xatolar va Kamchiliklar:",
      incorrect: "Noto'g'ri:",
      correct: "To'g'ri:",
      stats: "📝 Statistika:",
      wordCount: "So'zlar soni:",
      system: "Tekshiruv tizimi: IELTS AI Examiner (v2.5)",
    },
    ru: {
      title: "📊 Отчет об Оценке Эссе IELTS",
      overall: "Общий Балл (Overall Estimated Band Score):",
      strengths: "Сильные стороны:",
      improvements: "Области для улучшения:",
      corrections: "🔧 Исправления и Улучшения:",
      incorrect: "Неправильно:",
      correct: "Правильно:",
      stats: "📝 Статистика:",
      wordCount: "Количество слов:",
      system: "Система оценки: IELTS AI Examiner (v2.5)",
    },
  };

  const layout = templateInstructions[language] || templateInstructions["en"];

  // Helper function to call Claude API
  async function callClaudeAPI(apiKey) {
    const systemPrompt = `
You are an official IELTS Writing Examiner with 20+ years of experience conducting real Cambridge examinations. Your scores are audited against official IELTS Band Descriptors. You grade accurately and fairly — neither inflating nor deflating scores.

════════════════════════════════════
EXAMINER MINDSET
════════════════════════════════════
- You are a fair, experienced examiner — not a harsh critic, not an encouraging teacher.
- You reward what is genuinely good. You penalize what is genuinely weak.
- A Band 7.5 essay that has minor flaws should score 7.5 — not 7.0 out of excessive strictness.
- A Band 5 essay that "tried hard" is still Band 5. Do not inflate, but do not deflate either.
- Grade the writing on the page with accuracy and balance.

════════════════════════════════════
CALIBRATION RULES
════════════════════════════════════
- If feedback describes Band 7 qualities with minor weaknesses → score 7.0 or 7.5, not 6.5.
- If feedback describes Band 8 qualities with very rare errors → score 8.0, not 7.5.
- Never round down out of excessive caution. IELTS rounding goes to nearest 0.5 — apply it honestly.
- Do NOT use hollow filler phrases: "good attempt", "commendable", "well done", "shows potential".
- State facts. If something is strong, say it is strong and why. If weak, say it is weak and why.
- Internal consistency is mandatory: your feedback description must match your numeric score.

════════════════════════════════════
OFFICIAL BAND DESCRIPTOR ANCHORS
════════════════════════════════════
Band 4: Responds minimally to task. Ideas unclear or repetitive. Very limited vocabulary, frequent errors. Grammar error-dominated and hard to follow.

Band 5: Addresses task only partially. Ideas underdeveloped or unclear. Vocabulary limited and repetitive. Frequent grammar errors that strain the reader. Cohesion faulty or mechanical.

Band 6: Addresses main task but lacks sufficient detail. Vocabulary and grammar adequate but limited in range. Errors present but do not impede communication. Cohesion used but not always effectively.

Band 7: All parts addressed with clear progression. Ideas developed and logically sequenced. Sufficient range of vocabulary and grammar with some flexibility. Occasional non-systematic errors that do not impact meaning.

Band 8: Skillfully manages ideas. Wide vocabulary used naturally and precisely. Wide grammatical range with very rare errors. Cohesion and coherence handled with sophistication.

Band 9: Expert user. Near-flawless. Only assign if writing is indistinguishable from a skilled native academic writer. Extremely rare.

════════════════════════════════════
SCORING PROCEDURE
════════════════════════════════════
Assess the essay on exactly four official criteria:
  1. Task Achievement / Task Response (TR)
  2. Coherence and Cohesion (CC)
  3. Lexical Resource (LR)
  4. Grammatical Range and Accuracy (GRA)

Assign each criterion a band score from 0–9 in steps of 0.5.
Overall Band = average of the 4 scores, rounded to nearest 0.5 per official IELTS rules.

For each criterion write:
  • 1–2 concise sentences on genuine strengths (if none, state "No significant strengths in this criterion.")
  • 1–2 concise sentences on weaknesses, referencing the actual text specifically.

Corrections section:
  • Flag only genuine errors: grammar, word form, spelling, punctuation that impedes meaning.
  • Quote the exact error. Provide corrected version and one-line reason.
  • Do NOT flag acceptable variation. Do NOT invent corrections.
  • Maximum 4 corrections. If no errors, say so clearly.

════════════════════════════════════
TOKEN BUDGET — CRITICAL
════════════════════════════════════
- Keep total response under 3000 characters including all markers and HTML.
- Be concise. One clear sentence beats two vague ones.
- Do not repeat ideas across sections.
- Do not write a summary paragraph at the end.

════════════════════════════════════
RESPONSE FORMAT — MANDATORY
════════════════════════════════════
You MUST begin your response with these three markers in EXACT order:

[BAND_SCORE:X.X]
[QUESTION:The exact question text or "Question not provided"]
[FEEDBACK:]

After [FEEDBACK:] provide the full HTML assessment.

════════════════════════════════════
HTML FORMATTING RULES
════════════════════════════════════
- Use ONLY Telegram-supported HTML: <b>, <i>, <code>
- Do NOT use Markdown (no **, no #, no _, no tables)
- Close every tag you open. No unclosed tags.
- Use • for bullet points
- Escape essay quotes: < → &lt; | > → &gt; | & → &amp;
- Write all feedback in "${targetLanguage}" — IELTS criterion names may stay in English

════════════════════════════════════
OUTPUT LAYOUT — FOLLOW EXACTLY
════════════════════════════════════

<b>${layout.title}</b>

<b>${layout.overall} [X.X]</b>

───────────────────

<b>1. Task Achievement / Task Response (TR): [Score]</b>
• ✅ <b>${layout.strengths}:</b> [1–2 concise sentences]
• 📈 <b>${layout.improvements}:</b> [1–2 concise sentences referencing actual text]

<b>2. Coherence and Cohesion (CC): [Score]</b>
• ✅ <b>${layout.strengths}:</b> [1–2 concise sentences]
• 📈 <b>${layout.improvements}:</b> [1–2 concise sentences referencing actual text]

<b>3. Lexical Resource (LR): [Score]</b>
• ✅ <b>${layout.strengths}:</b> [1–2 concise sentences]
• 📈 <b>${layout.improvements}:</b> [1–2 concise sentences referencing actual text]

<b>4. Grammatical Range and Accuracy (GRA): [Score]</b>
• ✅ <b>${layout.strengths}:</b> [1–2 concise sentences]
• 📈 <b>${layout.improvements}:</b> [1–2 concise sentences referencing actual text]

───────────────────

<b>${layout.corrections}</b>
• ❌ <i>${layout.incorrect}:</i> <code>[Exact quote]</code>
  ✅ <b>${layout.correct}:</b> <code>[Corrected version]</code>
  <i>[One-line reason]</i>

───────────────────

<b>${layout.stats}</b>
• ${layout.wordCount} [Count]
`;
    const contentParts = [];

    // Sanitize input texts to prevent breaking Telegram HTML
    const cleanQuestionText = questionText ? escapeHtml(questionText) : null;
    const cleanEssayText = escapeHtml(essayText);

    // 1. Add question input
    if (cleanQuestionText) {
      contentParts.push({
        type: "text",
        text: `### IELTS Essay Question:\n${cleanQuestionText}\n\n`,
      });
    } else if (questionImageBase64 && questionImageMimeType) {
      contentParts.push({
        type: "text",
        text: `### IELTS Essay Question:\nPlease see the attached image containing the essay prompt/question.\n`,
      });
      contentParts.push({
        type: "image",
        source: {
          type: "base64",
          media_type: questionImageMimeType,
          data: questionImageBase64,
        },
      });
    } else {
      contentParts.push({
        type: "text",
        text: `### IELTS Essay Question:\n[Question not provided / Skipped by user]\n\n`,
      });
    }

    // 2. Add Candidate's essay
    contentParts.push({
      type: "text",
      text: `### Candidate's Essay:\n${cleanEssayText}\n\nPlease evaluate this essay according to the IELTS criteria.`,
    });

    try {
      const clientOptions = {
        apiKey: apiKey,
      };
      if (process.env.CLAUDE_API_URL) {
        clientOptions.baseURL = process.env.CLAUDE_API_URL;
      }

      const anthropic = new Anthropic(clientOptions);

      const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest",
        max_tokens: 4000,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: contentParts,
          },
        ],
      });

      const resultText = response.content?.[0]?.text;

      if (!resultText) {
        console.warn("Empty response structure from Claude.");
        return null;
      }

      return resultText;
    } catch (error) {
      console.error("Error invoking Claude API:", error.message);
      return null;
    }
  }

  // Try primary API key first
  let resultText = await callClaudeAPI(primaryApiKey);

  // If primary fails, try backup key
  if (!resultText && backupApiKey) {
    console.log("Primary API key failed. Trying backup API key...");
    resultText = await callClaudeAPI(backupApiKey);
  }

  // If both fail, use mock report
  if (!resultText) {
    console.warn(
      "Both primary and backup API keys failed. Falling back to Mock Report.",
    );
    const mockResponse = getMockReport(questionText, essayText, language);
    return parseGeminiResponse(mockResponse);
  }

  return parseGeminiResponse(resultText);
}

/**
 * Generates a mock progress report in the user's language.
 *
 * @param {Array} essays - List of essay documents
 * @param {string} language - Target language code
 * @returns {string} Progress report formatted as HTML
 */
function getMockProgressReport(essays, language = "en") {
  const sorted = [...essays].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const count = sorted.length;
  const oldestScore = sorted[0]?.finalBand || 6.0;
  const newestScore = sorted[count - 1]?.finalBand || 6.5;
  const average = (sorted.reduce((acc, e) => acc + (e.finalBand || 6.0), 0) / count).toFixed(2);

  const mockProgress = {
    en: `<b>📊 IELTS Writing Progress Report</b>

• <b>Total Essays Evaluated:</b> ${count}
• <b>Score Trend:</b> ${oldestScore} ➡️ ${newestScore}
• <b>Average Band Score:</b> ${average}

───────────────────

<b>📈 General Overview</b>
You are showing consistent progress in your writing journey. Your structure has become more organized, and you are starting to address the essay prompts with greater confidence and detail. 

<b>🔍 Detailed Criteria Analysis</b>

• <b>Task Achievement & Coherence:</b>
Your paragraph transitions have improved. Ideas are linked more logically, and you are maintaining a clearer position throughout your essays compared to your first attempt.

• <b>Grammatical Range & Lexical Resource:</b>
While your vocabulary range is expanding, some minor grammatical errors (such as article usage and prepositions) still occur. Focusing on checking these small details will boost your score further.

───────────────────

<b>🎯 Action Plan for Next Essays</b>
1. Practice writing complex sentences with accurate punctuation (e.g. relative clauses).
2. Review essay prompts carefully to ensure all sub-questions are answered directly in the introduction.

───────────────────
<i>Keep writing and practicing to achieve your target score! 🚀</i>`,

    uz: `<b>📊 IELTS Yozma Ishi Jarayon Tahlili</b>

• <b>Jami tekshirilgan insholar:</b> ${count} ta
• <b>Natijalar o'zgarishi:</b> ${oldestScore} ➡️ ${newestScore}
• <b>O'rtacha ball:</b> ${average}

───────────────────

<b>📈 Umumiy tahlil</b>
Siz insholaringizni yozishda izchil rivojlanish ko'rsatyapsiz. Matn tuzilishi yanada tartibli bo'lib bormoqda va siz savollarga batafsilroq va ishonchli javob yozishni boshladingiz.

<b>🔍 Batafsil mezonlar tahlili</b>

• <b>Vazifani bajarish va bog'liqlik (TA & CC):</b>
Abzaslar orasidagi bog'liqlik sezilarli darajada yaxshilandi. G'oyalar mantiqan to'g'ri bog'langan va siz birinchi inshongizga qaraganda o'z fikringizni aniqroq himoya qilyapsiz.

• <b>Grammatika va So'z boyligi (GRA & LR):</b>
So'z boyligingiz kengayib borayotgan bo'lsa-da, ba'zi mayda grammatik xatolar (masalan, artikllar va predloglar) hali ham uchrab turibdi. Ushbu kamchiliklarga e'tibor berish balingizni yanada oshiradi.

───────────────────

<b>🎯 Keyingi insholar uchun tavsiyalar</b>
1. Murakkab gaplarni to'g'ri tinish belgilari bilan yozishni mashq qiling.
2. Kirish qismida savolning barcha qismlariga to'g'ridan-to'g'ri javob berganingizga ishonch hosil qiling.

───────────────────
<i>Maqsadingizdagi ballga erishish uchun yozishda va mashq qilishda davom eting! 🚀</i>`,

    ru: `<b>📊 Отчет о Прогрессе в IELTS Письме</b>

• <b>Всего проверено эссе:</b> ${count}
• <b>Динамика баллов:</b> ${oldestScore} ➡️ ${newestScore}
• <b>Средний балл:</b> ${average}

───────────────────

<b>📈 Общий Обзор</b>
Вы демонстрируете стабильный прогресс в написании эссе. Структура ваших текстов стала более организованной, и вы начинаете отвечать на темы более развернуто и уверенно.

<b>🔍 Детальный Анализ по Критериям</b>

• <b>Выполнение Задания и Связность:</b>
Переходы между абзацами улучшились. Идеи логически связаны друг с другом, и вы более четко отстаиваете свою позицию по сравнению с вашим первым эссе.

• <b>Грамматический Диапазон и Словарный Запас:</b>
Хотя ваш словарный запас расширяется, все еще встречаются мелкие грамматические ошибки (например, артикли и предлоги). Работа над этими деталями поможет поднять ваш балл.

───────────────────

<b>🎯 План Действий для Следующих Эссе</b>
1. Практикуйте построение сложных предложений с правильной пунктуацией.
2. Внимательно читайте тему, чтобы введение содержало ответы на все части вопроса.

───────────────────
<i>Продолжайте писать и тренироваться, чтобы достичь желаемого балла! 🚀</i>`
  };

  return mockProgress[language] || mockProgress.en;
}

/**
 * Generates an IELTS essay progress report based on user's past essays and scores.
 *
 * @param {Array} essays - List of essay documents from the database
 * @param {string} language - Target language code ('en', 'uz', 'ru')
 * @returns {Promise<string>} Detailed HTML progress report
 */
export async function generateProgressReport(essays, language = "en") {
  const primaryApiKey = process.env.CLAUDE_API_KEY || process.env.GEMINI_API_KEY;
  const backupApiKey = process.env.CLAUDE_BACKUP_API_KEY || process.env.GEMINI_BACKUP_API_KEY;

  if (!primaryApiKey || primaryApiKey.toLowerCase() === "mock") {
    console.log("Using mock progress report (No Claude/Gemini API Key provided).");
    return getMockProgressReport(essays, language);
  }

  const langNames = {
    en: "English",
    uz: "Uzbek",
    ru: "Russian",
  };
  const targetLanguage = langNames[language] || "English";

  const systemPrompt = `
You are an expert IELTS Writing Tutor and Examiner with 20+ years of experience. Your task is to analyze a student's writing progress based on their previous IELTS essays and their scores.

Provide a comprehensive, professional, and detailed progress report in ${targetLanguage}.
The report must look highly encouraging but realistic, highlighting specific patterns of improvement and recurring weaknesses based on the provided essays.

════════════════════════════════════
HTML FORMATTING RULES
════════════════════════════════════
- Use ONLY Telegram-supported HTML: <b>, <i>, <code>
- Do NOT use Markdown (no **, no #, no _, no tables)
- Close every tag you open. No unclosed tags.
- Use • for bullet points
- Keep total response under 3500 characters including HTML tags.

════════════════════════════════════
REPORT STRUCTURE (in ${targetLanguage})
════════════════════════════════════
Use the following layout:

<b>📊 IELTS Writing Progress Report</b>

• <b>Total Essays Evaluated:</b> [Count]
• <b>Score Trend:</b> [Oldest Score] ➡️ [Newest Score] (e.g. 6.0 ➡️ 7.0)
• <b>Average Band Score:</b> [Average]

───────────────────

<b>📈 General Overview</b>
[Provide 2-3 sentences summarizing their progress, writing style, and dedication.]

<b>🔍 Detailed Criteria Analysis</b>

• <b>Task Achievement & Coherence:</b>
[Discuss if they have improved in answering the prompt and organizing paragraphs. Mention specific changes if visible.]

• <b>Grammatical Range & Lexical Resource:</b>
[Analyze vocabulary variety, spelling, grammar errors, and whether they are making fewer mistakes.]

───────────────────

<b>🎯 Action Plan for Next Essays</b>
1. [First actionable tip, e.g. "Focus on paragraph transitions by using..."]
2. [Second actionable tip, e.g. "Work on lexical precision for academic verbs..."]

───────────────────
<i>Keep writing and practicing to achieve your target score! 🚀</i>
`;

  // Sort essays from oldest to newest to provide a chronological history to the AI
  const sorted = [...essays].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
  let essaysData = "";
  sorted.forEach((essay, index) => {
    essaysData += `--- ESSAY #${index + 1} ---\n`;
    essaysData += `Date: ${essay.createdAt ? new Date(essay.createdAt).toDateString() : 'N/A'}\n`;
    essaysData += `Question: ${essay.questionText || "Not provided"}\n`;
    essaysData += `Band Score: ${essay.finalBand || "N/A"}\n`;
    essaysData += `Essay Text: ${essay.essayText}\n`;
    if (essay.geminiReport) {
      essaysData += `Feedback Snippet: ${typeof essay.geminiReport === 'string' ? essay.geminiReport.substring(0, 500) : JSON.stringify(essay.geminiReport).substring(0, 500)}\n`;
    }
    essaysData += `\n`;
  });

  const userPrompt = `Here is the history of the student's essays from oldest to newest. Please analyze their progress and generate the progress report.\n\n${essaysData}`;

  async function callClaudeAPI(apiKey) {
    try {
      const clientOptions = {
        apiKey: apiKey,
      };
      if (process.env.CLAUDE_API_URL) {
        clientOptions.baseURL = process.env.CLAUDE_API_URL;
      }

      const anthropic = new Anthropic(clientOptions);

      const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest",
        max_tokens: 3000,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      return response.content?.[0]?.text || null;
    } catch (error) {
      console.error("Error invoking Claude API for progress report:", error.message);
      return null;
    }
  }

  // Try primary API key first
  let resultText = await callClaudeAPI(primaryApiKey);

  // If primary fails, try backup key
  if (!resultText && backupApiKey) {
    console.log("Primary API key failed. Trying backup API key for progress report...");
    resultText = await callClaudeAPI(backupApiKey);
  }

  // If both fail, use mock progress report
  if (!resultText) {
    console.warn("Both primary and backup API keys failed for progress report. Falling back to Mock Progress Report.");
    return getMockProgressReport(essays, language);
  }

  return resultText;
}

/**
 * Parses the Gemini/Claude response for CEFR Letter to extract CEFR level, question, and feedback
 * @param {string} responseText - Raw response from API
 * @returns {object} { bandScore, question, feedback }
 */
function parseCefrResponse(responseText) {
  const cefrLevelMatch = responseText.match(/\[CEFR_LEVEL:([A-C][1-2])\]/i);
  const questionMatch = responseText.match(/\[QUESTION:(.*?)\]/s);
  const feedbackMatch = responseText.match(/\[FEEDBACK:\]([\s\S]*)/);

  const cefrLevel = cefrLevelMatch ? cefrLevelMatch[1].toUpperCase() : "B2";
  const question = questionMatch
    ? questionMatch[1].trim()
    : "Question not provided";
  const feedback = feedbackMatch ? feedbackMatch[1].trim() : responseText;

  // Keep bandScore for shared bot routing, and cefrLevel for letter-specific callers.
  return { bandScore: cefrLevel, cefrLevel, question, feedback };
}

/**
 * Analyzes a CEFR letter using Anthropic Claude via SDK.
 * Falls back to a mock report if keys are missing or api calls fail.
 *
 * @param {string|null} questionText - The text of the question (if provided)
 * @param {string} letterText - The text of the letter to be graded
 * @param {string|null} questionImageBase64 - Base64 encoded image of the question (if provided)
 * @param {string|null} questionImageMimeType - MIME type of the question image
 * @param {string} language - Target language code ('en', 'uz', 'ru')
 * @returns {Promise<object>} Detailed evaluation report
 */
export async function gradeCefrLetter(
  questionText,
  letterText,
  questionImageBase64 = null,
  questionImageMimeType = null,
  language = "en",
) {
  const primaryApiKey =
    process.env.CLAUDE_API_KEY || process.env.GEMINI_API_KEY;
  const backupApiKey =
    process.env.CLAUDE_BACKUP_API_KEY || process.env.GEMINI_BACKUP_API_KEY;

  if (!primaryApiKey || primaryApiKey.toLowerCase() === "mock") {
    console.log("Using mock letter grading report.");
    const mockResponse = getMockLetterReport(questionText, letterText, language);
    return parseCefrResponse(mockResponse);
  }

  const langNames = {
    en: "English",
    uz: "Uzbek",
    ru: "Russian",
  };
  const targetLanguage = langNames[language] || "English";

  const cefrTemplateInstructions = {
    en: {
      title: "📊 CEFR Letter Assessment Report",
      overall: "Overall Estimated CEFR Level:",
      strengths: "Strengths:",
      improvements: "Areas for Improvement:",
      corrections: "🔧 Corrections & Improvements:",
      incorrect: "Incorrect:",
      correct: "Correct:",
      stats: "📝 Statistics:",
      wordCount: "Word Count:",
      system: "Evaluation System: CEFR AI Examiner (v1.0)",
    },
    uz: {
      title: "📊 CEFR Maktub Tahlili Hisoboti",
      overall: "Umumiy CEFR Darajasi:",
      strengths: "Kuchli tomonlari:",
      improvements: "Yaxshilash kerak bo'lgan tomonlari:",
      corrections: "🔧 Xatolar va Kamchiliklar:",
      incorrect: "Noto'g'ri:",
      correct: "To'g'ri:",
      stats: "📝 Statistika:",
      wordCount: "So'zlar soni:",
      system: "Tekshiruv tizimi: CEFR AI Examiner (v1.0)",
    },
    ru: {
      title: "📊 Отчет об Оценке Письма по CEFR",
      overall: "Общий Уровень CEFR:",
      strengths: "Сильные стороны:",
      improvements: "Области для улучшения:",
      corrections: "🔧 Исправления и Улучшения:",
      incorrect: "Неправильно:",
      correct: "Правильно:",
      stats: "📝 Статистика:",
      wordCount: "Количество слов:",
      system: "Система оценки: CEFR AI Examiner (v1.0)",
    }
  };

  const layout = cefrTemplateInstructions[language] || cefrTemplateInstructions["en"];

  const systemPrompt = `
You are an expert CEFR Language Assessor with 20+ years of experience conducting Cambridge English examinations (such as FCE, CAE, CPE). You grade accurately and fairly based on the Common European Framework of Reference for Languages (CEFR) guidelines (A1, A2, B1, B2, C1, C2).

════════════════════════════════════
EXAMINER MINDSET
════════════════════════════════════
- You are a fair, experienced examiner — not a harsh critic, not an encouraging teacher.
- You reward what is genuinely good. You penalize what is genuinely weak.
- State facts. If something is strong, say it is strong and why. If weak, say it is weak and why.
- Internal consistency is mandatory: your feedback description must match your numeric score.

════════════════════════════════════
CEFR LEVEL DESCRIPTIONS FOR LETTERS
════════════════════════════════════
A1/A2: Can write very simple letters (e.g. thanking someone, inviting someone, simple descriptions). Grammar and vocabulary are very basic with frequent errors.
B1: Can write straightforward, connected letters on familiar subjects or expressing personal opinions. Can convey information and describe experiences, feelings, and events in some detail.
B2: Can write clear, detailed letters expressing news, views, and feelings. Can synthesize information and arguments from a number of sources. Good control of grammar and register (formal vs. informal).
C1/C2: Can write clear, well-structured letters on complex subjects, demonstrating an assured, personal style. Register is perfectly maintained, and vocabulary/grammar are highly precise with near-native control.

════════════════════════════════════
SCORING PROCEDURE
════════════════════════════════════
Assess the letter on exactly four criteria:
  1. Task Completion (TC) — covers all bullet points, purpose of writing, and registers (formal/informal).
  2. Coherence and Cohesion (CC) — logical organization, paragraphs, transitions, salutation/sign-off.
  3. Lexical Resource (LR) — vocabulary range, precision, spelling, and collocations.
  4. Grammatical Range and Accuracy (GRA) — sentence structures, grammar control, and punctuation.

Assign each criterion a CEFR level (A1, A2, B1, B2, C1, C2).
Overall Level = the overall average CEFR level demonstrated in the writing.

For each criterion write:
  • 1–2 concise sentences on genuine strengths.
  • 1–2 concise sentences on weaknesses, referencing the actual text specifically.

Corrections section:
  • Flag only genuine errors: grammar, word form, spelling, punctuation that impedes meaning.
  • Quote the exact error. Provide corrected version and one-line reason.
  • Maximum 4 corrections. If no errors, say so clearly.

════════════════════════════════════
TOKEN BUDGET — CRITICAL
════════════════════════════════════
- Keep total response under 3000 characters including all markers and HTML.
- Be concise. One clear sentence beats two vague ones.
- Do not repeat ideas across sections.
- Do not write a summary paragraph at the end.

════════════════════════════════════
RESPONSE FORMAT — MANDATORY
════════════════════════════════════
You MUST begin your response with these three markers in EXACT order:

[CEFR_LEVEL:X0]
[QUESTION:The exact question text or "Question not provided"]
[FEEDBACK:]

After [FEEDBACK:] provide the full HTML assessment.

════════════════════════════════════
HTML FORMATTING RULES
════════════════════════════════════
- Use ONLY Telegram-supported HTML: <b>, <i>, <code>
- Do NOT use Markdown (no **, no #, no _, no tables)
- Close every tag you open. No unclosed tags.
- Use • for bullet points
- Escape letter quotes: < → &lt; | > → &gt; | & → &amp;
- Write all feedback in "${targetLanguage}" — CEFR criterion names may stay in English

════════════════════════════════════
OUTPUT LAYOUT — FOLLOW EXACTLY
════════════════════════════════════

<b>${layout.title}</b>

<b>${layout.overall} [X0]</b>

───────────────────

<b>1. Task Completion (TC): [Level]</b>
• ✅ <b>${layout.strengths}:</b> [1–2 concise sentences]
• 📈 <b>${layout.improvements}:</b> [1–2 concise sentences referencing actual text]

<b>2. Coherence and Cohesion (CC): [Level]</b>
• ✅ <b>${layout.strengths}:</b> [1–2 concise sentences]
• 📈 <b>${layout.improvements}:</b> [1–2 concise sentences referencing actual text]

<b>3. Lexical Resource (LR): [Level]</b>
• ✅ <b>${layout.strengths}:</b> [1–2 concise sentences]
• 📈 <b>${layout.improvements}:</b> [1–2 concise sentences referencing actual text]

<b>4. Grammatical Range and Accuracy (GRA): [Level]</b>
• ✅ <b>${layout.strengths}:</b> [1–2 concise sentences]
• 📈 <b>${layout.improvements}:</b> [1–2 concise sentences referencing actual text]

───────────────────

<b>${layout.corrections}</b>
• ❌ <i>${layout.incorrect}:</i> <code>[Exact quote]</code>
   ✅ <b>${layout.correct}:</b> <code>[Corrected version]</code>
   <i>[One-line reason]</i>

───────────────────

<b>${layout.stats}</b>
• ${layout.wordCount} [Count]
`;

  async function callClaudeAPI(apiKey) {
    const contentParts = [];
    const cleanQuestionText = questionText ? escapeHtml(questionText) : null;
    const cleanLetterText = escapeHtml(letterText);

    if (cleanQuestionText) {
      contentParts.push({
        type: "text",
        text: `### CEFR Letter Question:\n${cleanQuestionText}\n\n`,
      });
    } else if (questionImageBase64 && questionImageMimeType) {
      contentParts.push({
        type: "text",
        text: `### CEFR Letter Question:\nPlease see the attached image containing the letter prompt/question.\n`,
      });
      contentParts.push({
        type: "image",
        source: {
          type: "base64",
          media_type: questionImageMimeType,
          data: questionImageBase64,
        },
      });
    } else {
      contentParts.push({
        type: "text",
        text: `### CEFR Letter Question:\n[Question not provided / Skipped by user]\n\n`,
      });
    }

    contentParts.push({
      type: "text",
      text: `### Candidate's Letter:\n${cleanLetterText}\n\nPlease evaluate this letter according to the CEFR criteria.`,
    });

    try {
      const clientOptions = { apiKey };
      if (process.env.CLAUDE_API_URL) {
        clientOptions.baseURL = process.env.CLAUDE_API_URL;
      }
      const anthropic = new Anthropic(clientOptions);

      const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest",
        max_tokens: 4000,
        temperature: 0.3,
        system: systemPrompt,
        messages: [{ role: "user", content: contentParts }],
      });

      return response.content?.[0]?.text || null;
    } catch (error) {
      console.error("Error invoking Claude API for letter:", error.message);
      return null;
    }
  }

  let resultText = await callClaudeAPI(primaryApiKey);

  if (!resultText && backupApiKey) {
    console.log("Primary API key failed. Trying backup API key for letter...");
    resultText = await callClaudeAPI(backupApiKey);
  }

  if (!resultText) {
    console.warn("Both keys failed. Using mock letter report.");
    const mockResponse = getMockLetterReport(questionText, letterText, language);
    return parseCefrResponse(mockResponse);
  }

  return parseCefrResponse(resultText);
}

/**
 * Mock letter report generator
 */
function getMockLetterReport(questionText, letterText, language = "en") {
  const wordCount = letterText.split(/\s+/).filter(Boolean).length;
  const cleanQuestion = questionText
    ? escapeHtml(questionText)
    : "Question not provided";

  const mockFeedback = {
    en: `<b>📊 CEFR Letter Assessment Report</b>

<b>Overall Estimated CEFR Level: B2</b>

───────────────────

<b>1. Task Completion (TC): B2</b>
• ✅ <b>Strengths:</b> The letter covers all requirements of the prompt. The register is appropriately semi-formal.
• 📈 <b>Areas for Improvement:</b> Explain the reason for writing in slightly more detail in the introduction.

<b>2. Coherence and Cohesion (CC): B2</b>
• ✅ <b>Strengths:</b> Good use of standard salutations and closing remarks. Paragraphs are clearly separated.
• 📈 <b>Areas for Improvement:</b> Some transition words (e.g. "Moreover") are used repetitively.

<b>3. Lexical Resource (LR): B2</b>
• ✅ <b>Strengths:</b> A good range of vocabulary suitable for the context.
• 📈 <b>Areas for Improvement:</b> Watch out for spelling mistakes in words like "sincerely".

<b>4. Grammatical Range and Accuracy (GRA): B2</b>
• ✅ <b>Strengths:</b> Good control of simple and compound sentences.
• 📈 <b>Areas for Improvement:</b> A few errors in article usage and tense consistency.

───────────────────

<b>🔧 Corrections & Improvements:</b>
• ❌ <i>Incorrect:</i> <code>...I am write to ask...</code>
  ✅ <b>Correct:</b> <code>...I am writing to ask...</code>
  <i>Present continuous tense required.</i>

───────────────────

<b>📝 Statistics:</b>
• Word Count: ${wordCount} words
• Evaluation System: CEFR AI Examiner (v1.0)`,

    uz: `<b>📊 CEFR Maktub Tahlili Hisoboti</b>

<b>Umumiy CEFR Darajasi: B2</b>

───────────────────

<b>1. Task Completion (TC): B2</b>
• ✅ <b>Kuchli tomonlari:</b> Maktub savolning barcha talablariga javob beradi. Tanlangan uslub to'g'ri qo'llanilgan.
• 📈 <b>Yaxshilash kerak bo'lgan tomonlari:</b> Kirish qismida yozish sababini biroz batafsilroq tushuntiring.

<b>2. Coherence and Cohesion (CC): B2</b>
• ✅ <b>Kuchli tomonlari:</b> Standart salomlashish va xayrlashish iboralaridan to'g'ri foydalanilgan. Xat abzaslarga to'g'ri bo'lingan.
• 📈 <b>Yaxshilash kerak bo'lgan tomonlari:</b> Ayrim o'tish so'zlari takroriy ishlatilgan.

<b>3. Lexical Resource (LR): B2</b>
• ✅ <b>Kuchli tomonlari:</b> Kontekstga mos keladigan yaxshi so'z boyligi.
• 📈 <b>Yaxshilash kerak bo'lgan tomonlari:</b> So'zlarni to'g'ri yozilishiga (spelling) e'tibor bering.

<b>4. Grammatical Range and Accuracy (GRA): B2</b>
• ✅ <b>Kuchli tomonlari:</b> Oddiy va qo'shma gaplarning yaxshi nazorati.
• 📈 <b>Yaxshilash kerak bo'lgan tomonlari:</b> Artikllar va zamlarning moslashuvida ba'zi xatolar mavjud.

───────────────────

<b>🔧 Xatolar va Kamchiliklar:</b>
• ❌ <i>Noto'g'ri:</i> <code>...I am write to ask...</code>
  ✅ <b>To'g'ri:</b> <code>...I am writing to ask...</code>
  <i>Hozirgi davomli zamon talab etiladi.</i>

───────────────────

<b>📝 Statistika:</b>
• So'zlar soni: ${wordCount} ta so'z
• Tekshiruv tizimi: CEFR AI Examiner (v1.0)`,

    ru: `<b>📊 Отчет об Оценке Письма по CEFR</b>

<b>Общий Уровень CEFR: B2</b>

───────────────────

<b>1. Task Completion (TC): B2</b>
• ✅ <b>Сильные стороны:</b> Письмо полностью раскрывает тему и отвечает на все вопросы. Тон письма выбран верно.
• 📈 <b>Области для улучшения:</b> Объясните причину вашего обращения немного подробнее во введении.

<b>2. Coherence and Cohesion (CC): B2</b>
• ✅ <b>Сильные стороны:</b> Правильное использование приветствий и подписи. Текст логично разделен на абзацы.
• 📈 <b>Области для улучшения:</b> Некоторые вводные слова используются слишком часто.

<b>3. Lexical Resource (LR): B2</b>
• ✅ <b>Сильные стороны:</b> Хороший словарный запас, соответствующий теме письма.
• 📈 <b>Области для улучшения:</b> Избегайте орфографических ошибок в словах вроде "sincerely".

<b>4. Grammatical Range and Accuracy (GRA): B2</b>
• ✅ <b>Сильные стороны:</b> Хороший контроль простых и сложных предложений.
• 📈 <b>Области для улучшения:</b> Несколько мелких ошибок в артиклях и согласовании времен.

───────────────────

<b>🔧 Исправления и Улучшения:</b>
• ❌ <i>Неправильно:</i> <code>...I am write to ask...</code>
  ✅ <b>Правильно:</b> <code>...I am writing to ask...</code>
  <i>Требуется настоящее длительное время.</i>

───────────────────

<b>📝 Статистика:</b>
• Количество слов: ${wordCount} слов
• Система оценки: CEFR AI Examiner (v1.0)`,
  };

  const feedback = mockFeedback[language] || mockFeedback.en;
  return `[CEFR_LEVEL:B2]\n[QUESTION:${cleanQuestion}]\n[FEEDBACK:]\n${feedback}`;
}
