import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import bot from './bot.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const API_PORT = process.env.ADMIN_API_PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.locals.bot = bot;

app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'admin-api' });
});

app.get('/', (req, res) => {
  res.json({ message: 'IELTS Bot Admin API Server', version: '1.0.0' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

async function startServer() {
  try {
    await connectDB();

    app.listen(API_PORT, () => {
      console.log('------------------------------------------------');
      console.log(`📊 Admin API Server running on port ${API_PORT}`);
      console.log('------------------------------------------------');
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdowns
process.once('SIGINT', () => {
  console.log('Shutting down...');
  process.exit(0);
});
process.once('SIGTERM', () => {
  console.log('Shutting down...');
  process.exit(0);
});
