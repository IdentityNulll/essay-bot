# IELTS Bot Admin Panel - Setup Guide

## 🎉 Overview

Your admin panel is now complete! This includes:
- **React + Vite Dashboard** - Professional admin interface
- **Express API Server** - RESTful API for admin operations
- **MongoDB Integration** - All user data, essays, and admin accounts
- **Real-time User Management** - View and manage all users
- **Essay Analytics** - View all submitted essays with band scores
- **Broadcast Messaging** - Send messages directly to user Telegram chats
- **JWT Authentication** - Secure admin login

---

## 📋 Requirements

Make sure you have:
- Node.js v18+
- MongoDB running locally or accessible via URI
- Telegram Bot Token (from @BotFather)
- Google Gemini API Key

---

## 🚀 Quick Setup

### 1. **Install Dependencies**

```bash
# Backend dependencies
npm install

# Frontend dependencies
cd admin-dashboard
npm install
cd ..
```

### 2. **Create Initial Admin Account**

Create a MongoDB admin user:

```bash
# Open MongoDB shell
mongosh

# Switch to your database
use ielts_bot

# Create admin user (password will be auto-hashed)
db.admins.insertOne({
  username: "admin",
  email: "admin@example.com",
  password: "your_secure_password_here",
  role: "super_admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Note:** Passwords are automatically hashed with bcrypt before saving, so the raw password you enter above will be encrypted in the database.

### 3. **Configure Environment Variables**

**Main .env file:**

```bash
cp .env.example .env
# Edit .env and fill in your values:
# - TELEGRAM_BOT_TOKEN
# - MONGO_URI
# - GEMINI_API_KEY
# - JWT_SECRET (any strong random string)
# - ADMIN_API_PORT (default: 3001)
```

**Admin Dashboard .env file:**

```bash
cd admin-dashboard
cp .env.example .env
# Edit .env if needed (default API URL: http://localhost:3001/api)
cd ..
```

### 4. **Start the Bot + Admin API**

```bash
# This starts BOTH the Telegram bot AND the admin API server
npm start

# You should see:
# 🤖 IELTS AI Essay Grader Telegram Bot is online!
# 📊 Admin API Server running on port 3001
```

### 5. **Start the Admin Dashboard (in another terminal)**

```bash
cd admin-dashboard
npm run dev

# Opens http://localhost:3000 in your browser
```

### 6. **Login to Admin Panel**

- Navigate to http://localhost:3000
- Login with credentials from Step 2 (username: `admin`)
- Start managing your bot!

---

## 📊 Features

### Dashboard
- **Total Users**: Overall user count
- **Essays Checked**: Total submissions
- **Average Credits**: Per-user credit distribution
- **Band Score Distribution**: Analytics on essay grades
- **Users with Discounts**: Referral program participants

### Users Management
- View all users with search
- See user credits and essay counts
- View user language preference and registration date
- Manually adjust user credits
- View user's essay history with band scores

### Essays Management
- Browse all submitted essays
- Filter by band score range
- View essay content and AI feedback
- See word count and submission date
- Track which users submitted essays

### Broadcast Messaging
- Send messages to:
  - All users
  - Specific language groups
  - Users in a credit range
- Messages delivered directly to Telegram
- HTML formatting support (`<b>`, `<i>`, `<code>`)
- Success/failure tracking

### Admin Authentication
- Secure JWT-based login
- Token expires in 7 days
- Session persists via localStorage

---

## 🔧 API Endpoints

All endpoints require `Authorization: Bearer <token>` header.

### Authentication
- `POST /api/admin/login` - Login with username/password

### Statistics
- `GET /api/admin/stats` - Dashboard statistics

### Users
- `GET /api/admin/users` - List all users (paginated)
- `GET /api/admin/users/:userId` - Get user details + essays
- `PUT /api/admin/users/:userId/credits` - Update user credits

### Essays
- `GET /api/admin/essays` - List all essays (paginated, filterable)
- `GET /api/admin/essays/:essayId` - Get essay details

### Broadcasting
- `POST /api/admin/broadcast` - Send message to users

---

## 🗄️ Database Models

### User Model
```javascript
{
  userId: String (Telegram ID),
  username: String,
  selectedLanguage: String,
  creditCount: Number,
  essaysCount: Number,
  currentState: String,
  promoCode: String,
  promoCodeCount: Number,
  usedPromoCode: String,
  receivedBonusDiscount: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Essay Model
```javascript
{
  userId: String,
  questionText: String,
  essayText: String,
  source: String, // 'text', 'pdf', 'docx', 'image'
  wordCount: Number,
  geminiReport: Object,
  bandScores: {
    writing: Number,
    grammar: Number,
    lexicon: Number,
    coherence: Number
  },
  finalBand: Number,
  processingTime: Number,
  language: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String, // 'admin' or 'super_admin'
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📝 Troubleshooting

### Admin can't login
- Check MongoDB admin collection has the user
- Verify JWT_SECRET is set in .env
- Make sure API server is running on port 3001

### Essays not saving
- Check bot.js has Essay model imported
- Verify MongoDB connection is working
- Check essay data is valid before saving

### Broadcast messages not sending
- Verify bot token is valid
- Check user userId is correct
- Ensure user hasn't blocked the bot

### Bot not starting
- Check MONGO_URI is correct
- Verify TELEGRAM_BOT_TOKEN is valid
- Make sure MongoDB is running

---

## 🔐 Security Notes

1. **Change JWT_SECRET** - Use a strong random string in production
2. **Use HTTPS** - In production, always use HTTPS for admin panel
3. **Strong Admin Passwords** - Use complex passwords for admin accounts
4. **Limit Admin Access** - Only give admin access to trusted people
5. **Regular Backups** - Backup MongoDB regularly

---

## 🎯 Next Steps

1. ✅ Create admin accounts for your team
2. ✅ Start the bot and begin receiving essays
3. ✅ Monitor dashboard for user activity
4. ✅ Manage credits and bonuses
5. ✅ Send broadcast messages as needed

---

## 📞 Support

If you encounter issues:
1. Check logs in terminal
2. Verify all environment variables
3. Check MongoDB is running
4. Make sure ports 3000 and 3001 are free

Good luck with your IELTS Bot Admin Panel! 🚀
