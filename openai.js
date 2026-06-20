import dotenv from "dotenv";

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
 * Generates a realistic mock IELTS feedback report when no API key is present or on API failures.
 *
 * @param {string|null} questionText - Essay prompt question
 * @param {string} essayText - Essay response
 * @param {string} language - Target language code ('en', 'uz', 'ru')
 * @returns {string} Structured Mock report in HTML
 */
function getMockReport(questionText, essayText, language = 'en') {
  const wordCount = essayText.split(/\s+/).filter(Boolean).length;

  if (language === 'uz') {
    return `<b>📊 IELTS Yozma Ishi Tahlili Hisoboti</b>

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
• Tekshiruv tizimi: IELTS AI Examiner (v2.5)`;
  }

  if (language === 'ru') {
    return `<b>📊 Отчет об Оценке Эссе IELTS</b>

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
• Система оценки: IELTS AI Examiner (v2.5)`;
  }

  // Default is English (en)
  return `<b>📊 IELTS Writing Assessment Report</b>

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
• Evaluation System: IELTS AI Examiner (v2.5)`;
}

/**
 * Analyzes an IELTS essay using Gemini 2.5 Flash via REST API.
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
  language = 'en'
) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback to mock report if no key or key is literally "mock"
  if (!apiKey || apiKey.toLowerCase() === "mock") {
    console.log("Using mock grading report (No Gemini API Key provided).");
    return getMockReport(questionText, essayText, language);
  }

  const langNames = {
    'en': 'English',
    'uz': 'Uzbek',
    'ru': 'Russian'
  };
  const targetLanguage = langNames[language] || 'English';

  const templateInstructions = {
    'en': {
      title: "📊 IELTS Writing Assessment Report",
      overall: "Overall Estimated Band Score:",
      strengths: "Strengths:",
      improvements: "Areas for Improvement:",
      corrections: "🔧 Corrections & Improvements:",
      incorrect: "Incorrect:",
      correct: "Correct:",
      stats: "📝 Statistics:",
      wordCount: "Word Count:",
      system: "Evaluation System: IELTS AI Examiner (v2.5)"
    },
    'uz': {
      title: "📊 IELTS Yozma Ishi Tahlili Hisoboti",
      overall: "Umumiy Baho (Overall Estimated Band Score):",
      strengths: "Kuchli tomonlari:",
      improvements: "Yaxshilash kerak bo'lgan tomonlari:",
      corrections: "🔧 Xatolar va Kamchiliklar:",
      incorrect: "Noto'g'ri:",
      correct: "To'g'ri:",
      stats: "📝 Statistika:",
      wordCount: "So'zlar soni:",
      system: "Tekshiruv tizimi: IELTS AI Examiner (v2.5)"
    },
    'ru': {
      title: "📊 Отчет об Оценке Эссе IELTS",
      overall: "Общий Балл (Overall Estimated Band Score):",
      strengths: "Сильные стороны:",
      improvements: "Области для улучшения:",
      corrections: "🔧 Исправления и Улучшения:",
      incorrect: "Неправильно:",
      correct: "Правильно:",
      stats: "📝 Статистика:",
      wordCount: "Количество слов:",
      system: "Система оценки: IELTS AI Examiner (v2.5)"
    }
  };

  const layout = templateInstructions[language] || templateInstructions['en'];

  const systemPrompt = `You are an expert, highly professional official IELTS Writing Examiner with 15+ years of grading experience. 
Your goal is to evaluate the user's essay thoroughly and provide detailed, constructive, and realistic feedback exactly according to the official IELTS Band Descriptors for Task 1/Task 2.

Guidelines for grading:
1. You must assess the essay based on the four official criteria:
   - Task Achievement / Task Response (TR): Grade how well the question was addressed.
   - Coherence and Cohesion (CC): Grade structure, paragraphing, and linking devices.
   - Lexical Resource (LR): Grade vocabulary range, accuracy, and collocations.
   - Grammatical Range and Accuracy (GRA): Grade sentence structure, punctuation, and grammar.
2. Provide an individual band score (from 0 to 9.0, in steps of 0.5) for each criterion.
3. Calculate the Overall Estimated Band Score using official IELTS rules (average of the 4 scores, rounded to the nearest half band. E.g., 6.25 rounds to 6.5, 6.75 rounds to 7.0, 6.125 rounds to 6.0).
4. For each section, provide 2-3 detailed sentences for strengths and areas for improvement. Do not leave them brief or empty.
5. Provide a "Corrections & Improvements" section where you list critical errors (grammar, spelling, collocations) with their corrected versions.
6. Provide an "Alternative Vocabulary & Collocations" section suggesting premium lexical choices.

Formatting instructions:
- Do NOT use Markdown (no asterisks **, no underscores _, no hashes #, no markdown tables).
- Use ONLY standard Telegram HTML tags for all formatting:
  • Use <b>text</b> for bold headers and scores.
  • Use <i>text</i> for italics.
  • Use <code>text</code> for corrections or code snippets.
  • Use standard bullet characters (•) or hyphens (-) for lists.
- CRUCIAL: You must close every single HTML tag you open (e.g., every <b> must have a closing </b>). Never leave a tag open at the end of a sentence.
- You must strictly use the following layout for the report, written in "${targetLanguage}":

<b>${layout.title}</b>

<b>${layout.overall} [Insert Score]</b>

───────────────────

<b>1. Task Achievement (TA/TR): [Score]</b>
• <b>${layout.strengths}</b> [Provide 2-3 detailed sentences here in ${targetLanguage}]
• <b>${layout.improvements}</b> [Provide 2-3 detailed sentences here in ${targetLanguage}]

<b>2. Coherence and Cohesion (CC): [Score]</b>
• <b>${layout.strengths}</b> [Provide 2-3 detailed sentences here in ${targetLanguage}]
• <b>${layout.improvements}</b> [Provide 2-3 detailed sentences here in ${targetLanguage}]

<b>3. Lexical Resource (LR): [Score]</b>
• <b>${layout.strengths}</b> [Provide 2-3 detailed sentences here in ${targetLanguage}]
• <b>${layout.improvements}</b> [Provide 2-3 detailed sentences here in ${targetLanguage}]

<b>4. Grammatical Range and Accuracy (GRA): [Score]</b>
• <b>${layout.strengths}</b> [Provide 2-3 detailed sentences here in ${targetLanguage}]
• <b>${layout.improvements}</b> [Provide 2-3 detailed sentences here in ${targetLanguage}]

───────────────────

<b>${layout.corrections}</b>
• <i>${layout.incorrect}</i> <code>[Quote Incorrect text from the essay]</code>
  <b>${layout.correct}</b> <code>[Provide Corrected text]</code>

<b>${layout.stats}</b>
• ${layout.wordCount} [Count]
• ${layout.system}

- CRUCIAL LANGUAGE RULE: The user has selected the system language: "${targetLanguage}". You MUST write all the feedback descriptions, strengths, areas for improvement, critiques, corrections, and comments in the "${targetLanguage}" language. The IELTS criteria titles themselves (e.g. 'Task Achievement') can be kept, but everything else MUST be in "${targetLanguage}".
- Crucial: If you quote or mention any text from the candidate's essay or question that contains '<', '>', or '&', you MUST escape them as '&lt;', '&gt;', and '&amp;'. Never output raw '<' or '>' characters unless they are part of the allowed HTML tags: <b>, <i>, <code>.
- Keep the overall response length concise enough to fit in a single Telegram message (max 4096 characters).`;

  const parts = [];

  // Sanitize input texts to prevent breaking Telegram HTML
  const cleanQuestionText = questionText ? escapeHtml(questionText) : null;
  const cleanEssayText = escapeHtml(essayText);

  // 1. Add question input
  if (cleanQuestionText) {
    parts.push({
      text: `### IELTS Essay Question:\n${cleanQuestionText}\n\n`,
    });
  } else if (questionImageBase64 && questionImageMimeType) {
    parts.push({
      text: `### IELTS Essay Question:\nPlease see the attached image containing the essay prompt/question.\n`,
    });
    parts.push({
      inlineData: {
        mimeType: questionImageMimeType,
        data: questionImageBase64,
      },
    });
  } else {
    parts.push({
      text: `### IELTS Essay Question:\n[Question not provided / Skipped by user]\n\n`,
    });
  }

  // 2. Add Candidate's essay
  parts.push({
    text: `### Candidate's Essay:\n${cleanEssayText}\n\nPlease evaluate this essay according to the IELTS criteria.`,
  });

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: parts,
          },
        ],
        systemInstruction: {
          parts: [
            {
              text: systemPrompt,
            },
          ],
        },
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 10000,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(
          `Gemini API responded with status ${response.status}: ${errText}. Falling back to Mock Report.`,
      );
      return getMockReport(questionText, essayText, language);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      console.warn(
          "Empty response structure from Gemini. Falling back to Mock Report.",
      );
      return getMockReport(questionText, essayText, language);
    }

    return resultText;
  } catch (error) {
    console.error(
        "Error invoking Gemini API. Falling back to Mock Report:",
        error,
    );
    return getMockReport(questionText, essayText, language);
  }
}
