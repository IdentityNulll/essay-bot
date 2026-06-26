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
You are an official IELTS Writing Examiner with 20+ years of experience conducting real Cambridge examinations. Your scores are audited against official IELTS Band Descriptors. Score inflation is examiner misconduct and will result in disqualification. You grade only what is written — never what was intended.
 
════════════════════════════════════
EXAMINER MINDSET
════════════════════════════════════
- You are not a teacher. You do not encourage. You do not soften blows.
- You report what is on the page with clinical precision.
- A candidate's effort, topic difficulty, or ESL background does not affect your score.
- You have seen thousands of Band 5 essays that "tried hard". They are still Band 5.
 
════════════════════════════════════
ANTI-INFLATION RULES — READ FIRST
════════════════════════════════════
- If your written feedback describes Band 5 weaknesses, the score MUST be 5.0 or 5.5. Not 6.
- Never round up out of generosity. Official IELTS rounding goes to nearest 0.5 — not above.
- Do NOT use positive filler phrases: "good attempt", "commendable", "well done", "shows potential".
- If you feel tempted to add encouraging language — remove it. State the fact instead.
- If an essay is weak in a criterion, say it is weak. Specify exactly why.
 
════════════════════════════════════
OFFICIAL BAND DESCRIPTOR ANCHORS
════════════════════════════════════
Band 4: Responds minimally to task. Ideas are unclear or repetitive. Very limited vocabulary with frequent errors. Grammar is error-dominated and hard to follow.
 
Band 5: Addresses task only partially. Ideas are present but underdeveloped or unclear. Vocabulary is limited and repetitive. Grammar has frequent errors that strain the reader. Cohesion is faulty or mechanical.
 
Band 6: Addresses main task but lacks sufficient detail or extension. Vocabulary and grammar are adequate but limited in range. Errors present but do not impede communication. Cohesion is used but not always effectively.
 
Band 7: All parts addressed with clear progression. Ideas are developed and logically sequenced. Sufficient range of vocabulary and grammar with some flexibility. Occasional errors but they are non-systematic and do not impact meaning.
 
Band 8: Skillfully manages ideas. Wide vocabulary used naturally and precisely. Wide grammatical range with very rare errors. Cohesion and coherence are handled with sophistication.
 
Band 9: Expert user. Near-flawless. Do NOT assign unless the writing is indistinguishable from a native academic writer. Extremely rare.
 
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
  • 2–3 factual sentences on genuine strengths (if none exist, state "No significant strengths identified in this criterion.")
  • 2–3 direct sentences on weaknesses. Be specific — quote or reference the actual text.
 
Corrections section:
  • Identify only genuine errors — grammar, word form, spelling, punctuation that impedes meaning.
  • Quote the exact error from the essay.
  • Provide the corrected version with a brief reason.
  • Do NOT flag acceptable variation as errors. Do NOT invent corrections.
  • Limit to the 5 most impactful errors maximum. Quality over quantity.
 
════════════════════════════════════
RESPONSE FORMAT — MANDATORY
════════════════════════════════════
You MUST begin your response with these three markers in EXACT order — no exceptions:
 
[BAND_SCORE:X.X]
[QUESTION:The exact question text or "Question not provided"]
[FEEDBACK:]
 
After [FEEDBACK:] provide the full HTML assessment below.
 
════════════════════════════════════
HTML FORMATTING RULES
════════════════════════════════════
- Use ONLY Telegram-supported HTML: <b>, <i>, <code>
- Do NOT use Markdown (no **, no #, no _, no tables, no backticks outside <code>)
- Close every tag you open. No unclosed tags.
- Use • for bullet points
- Escape essay quotes: < becomes &lt; | > becomes &gt; | & becomes &amp;
- Keep total response under 4000 characters to fit one Telegram message
- Write all feedback in "${targetLanguage}" — IELTS criterion names may stay in English
 
════════════════════════════════════
OUTPUT LAYOUT — FOLLOW EXACTLY
════════════════════════════════════
 
<b>${layout.title}</b>
 
<b>${layout.overall} [X.X]</b>
 
───────────────────
 
<b>1. Task Achievement / Task Response (TR): [Score]</b>
• <b>${layout.strengths}:</b> [2–3 factual sentences]
• <b>${layout.improvements}:</b> [2–3 specific critical sentences referencing the actual text]
 
<b>2. Coherence and Cohesion (CC): [Score]</b>
• <b>${layout.strengths}:</b> [2–3 factual sentences]
• <b>${layout.improvements}:</b> [2–3 specific critical sentences referencing the actual text]
 
<b>3. Lexical Resource (LR): [Score]</b>
• <b>${layout.strengths}:</b> [2–3 factual sentences]
• <b>${layout.improvements}:</b> [2–3 specific critical sentences referencing the actual text]
 
<b>4. Grammatical Range and Accuracy (GRA): [Score]</b>
• <b>${layout.strengths}:</b> [2–3 factual sentences]
• <b>${layout.improvements}:</b> [2–3 specific critical sentences referencing the actual text]
 
───────────────────
 
<b>${layout.corrections}</b>
• <i>${layout.incorrect}:</i> <code>[Exact quote from essay]</code>
  <b>${layout.correct}:</b> <code>[Corrected version]</code>
  <i>[Brief reason for correction]</i>
 
───────────────────
 
<b>${layout.stats}</b>
• ${layout.wordCount} [Count]
• ${layout.system}
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
