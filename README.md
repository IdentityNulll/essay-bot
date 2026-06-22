# IELTS Essay Examiner Telegram Bot 🤖

A production-ready, highly scalable, and beautifully designed Telegram bot that evaluates IELTS Writing tasks using **Google Gemini (gemini-2.5-flash)** based on the official IELTS band descriptors.

---

## 🛠 Tech Stack

*   **Runtime:** Node.js (v22.18.0+)
*   **Framework:** Telegraf v4+ (Telegram Bot API wrapper)
*   **Database:** MongoDB via Mongoose
*   **AI Engine:** Gemini REST API (using `gemini-2.5-flash` with vision) or Mock Fallback Mode
*   **Document Parsers:** `pdf-parse` (PDF) and `mammoth` (DOCX)
*   **Language Syntax:** Modern ES Modules (`import/export`)

---

## 📁 Directory Structure

```text
essay-bot/
├── config/
│   └── db.js                    # MongoDB connection configuration
├── models/
│   ├── User.js                  # User profiles & state
│   ├── Essay.js                 # Essay submissions & grading data
│   └── Admin.js                 # Admin accounts with JWT auth
├── middleware/
│   └── adminAuth.js             # JWT verification middleware
├── routes/
│   └── admin.js                 # Admin API routes
├── controllers/
│   └── adminController.js       # Admin business logic
├── utils/
│   └── jwt.js                   # JWT token utilities
├── admin-dashboard/             # React + Vite admin panel
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── UsersPage.jsx
│   │   │   ├── EssaysPage.jsx
│   │   │   └── BroadcastPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
├── server.js                    # Express API server
├── bot.js                       # Telegram bot core
├── openai.js                    # Gemini API integration
├── translations.js              # i18n dictionary
├── documentParser.js            # PDF & DOCX parser
├── .env.example                 # Environment template
├── ADMIN_SETUP.md               # Admin panel setup guide
└── package.json                 # Dependencies
```

---

## 🚀 Installation & Setup

### 1. Clone & Install Dependencies

```bash
# Navigate to project root
cd essay-bot

# Install npm packages
npm install
```

### 2. Configure Environment Variables

Duplicate the template environment file:
```bash
cp .env.example .env
```

Open `.env` and fill in the configuration options:
```ini
# Telegram Token from @BotFather
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN

# MongoDB Connection String (Local default)
MONGO_URI=mongodb://localhost:27017/ielts_bot

# Gemini API Key (Enter 'mock' to run in test/offline mode without a key)
GEMINI_API_KEY=mock

# Optional: Admin Chat ID for manual payment approvals (e.g. 562947192)
# If left blank, the bot will dynamically look up a user with username 'identitynull'
ADMIN_CHAT_ID=
```

---

## ⚙️ Running the Bot

### Development Mode (with hot-reloading)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

---

## 📱 How to Use & Test

### 1. Initialization (`/start`)
- Run `/start` in the bot.
- If it's your first time, you will be prompted to select a language: **🇺🇿 O'zbekcha**, **🇷🇺 Русский**, or **🇬🇧 English**.
- Selecting a language will register your account in MongoDB with **1 free trial essay credit**.

### 2. Utility Commands
- `/help` - Step-by-step instructions on how to submit essays and receive scores.
- `/commands` - Lists all available system commands.
- `/contact` - Displays support and contact information pointing to the admin user: `@identitynull`.
- `/profile` - Displays your current username, user ID, selected language, and remaining credits.

### 3. Essay Assessment Flow (`/check`)
1. Run `/check` or click **📝 Check Essay** on your menu keyboard.
2. **Phase 1 (The Question)**: The bot asks for the Essay Question/Prompt.
    - Type or copy-paste the text of the prompt.
    - Send an image of the prompt (the bot will use Gemini vision to read the prompt directly!).
    - Tap **⏩ Skip if question is in PDF/Doc** if the question is already in your essay file.
3. **Phase 2 (The Essay)**: The bot asks for the essay body.
    - Send it as copy-pasted text.
    - Upload a `.pdf` or `.docx` document file.
4. **Grading & Feedback**: An animated processing message is displayed. Once ready, the bot deducts 1 credit, resets your state to IDLE, and sends a highly detailed IELTS score sheet containing:
    - Overall estimated Band Score.
    - Separate scores (0.0–9.0) for *Task Response*, *Coherence & Cohesion*, *Lexical Resource*, and *Grammatical Range & Accuracy*.
    - Specific grammatical corrections, alternative vocabulary suggestions, and improvement tips.

*(Note: If GEMINI_API_KEY is set to 'mock', the bot generates a beautiful offline mock evaluation report immediately, making it easy to test without active API fees!)*

### 4. Premium Upgrade (Manual Payment Flow)
- If your credit balance falls to `0`, trying to start `/check` will block the flow and prompt you with:
    - Premium pricing lists (e.g. 5 checks for 25,000 UZS).
    - Payment instructions with card details.
- To upgrade:
    1. Transfer the money to the specified card.
    2. Reply directly to the payment details message by uploading a receipt screenshot.
    3. The bot forwards the receipt to the administrator (`@identitynull`) along with two inline actions: **[✅ Approve Payment]** and **[❌ Deny Payment]**.
    4. If the admin clicks **Approve**, the user receives **+5 essay credits** and a notification is sent in their chosen language.
    5. If the admin clicks **Deny**, the user is notified of the rejection.

---

## 🛡 Robustness & Production Features

*   **Multilingual Architecture:** Simple dictionary file (`translations.js`) that supports dynamically formatting string templates.
*   **State Machine Persistence:** User state is saved in MongoDB rather than Node.js memory. If the server crashes or restarts, users continue their essay grading flows exactly where they left off.
*   **Advanced Message Splitting:** Bypasses the Telegram 4096-character limit by splitting feedback reports cleanly at line breaks.
*   **Robust Markdown Fallback:** Prevents Telegram entity parsing errors from blocking delivery by falling back to plain text if Markdown format fails to compile.
*   **Auto Admin Discovery:** If `ADMIN_CHAT_ID` is left empty in `.env`, the bot automatically retrieves the chat ID of the user with the username `@identitynull` once they interact with the bot.

---

## 📊 Admin Panel Features

A complete professional admin dashboard has been integrated! Access it at `http://localhost:3000`:

### Key Features
- **User Management**: View all users, manage credits, track essay submissions
- **Essay Analytics**: Filter by band score, view full feedback reports
- **Broadcast Messaging**: Send messages directly to user Telegram chats
- **Dashboard Stats**: Overall user count, essay metrics, band distribution
- **JWT Authentication**: Secure admin-only access
- **Responsive UI**: Works on desktop and mobile

### Setup Admin Panel
See [**ADMIN_SETUP.md**](./ADMIN_SETUP.md) for complete setup instructions.

**Quick Start:**
```bash
# 1. Install backend deps (if not done)
npm install

# 2. Create admin account in MongoDB
mongosh
use ielts_bot
db.admins.insertOne({
  username: "admin",
  email: "admin@example.com",
  password: "your_password",
  role: "super_admin",
  isActive: true
})

# 3. Start bot + API server
npm start

# 4. In another terminal, start dashboard
cd admin-dashboard
npm install
npm run dev

# 5. Open http://localhost:3000 and login
```

---