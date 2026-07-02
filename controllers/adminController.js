import User from '../models/User.js';
import Essay from '../models/Essay.js';
import Admin from '../models/Admin.js';
import { generateToken } from '../utils/jwt.js';

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const admin = await Admin.findOne({ username, isActive: true });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(admin._id.toString(), admin.username);
    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEssays = await Essay.countDocuments({ type: { $ne: 'letter' } });
    const totalLetters = await Essay.countDocuments({ type: 'letter' });
    const totalCredits = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$creditCount' } } }
    ]);

    // Only aggregate numeric band scores (essays), not CEFR string levels (letters)
    const bandDistribution = await Essay.aggregate([
      { $match: { type: { $ne: 'letter' } } },
      { $group: { _id: '$finalBand', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const cefrDistribution = await Essay.aggregate([
      { $match: { type: 'letter' } },
      { $group: { _id: '$finalBand', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const avgCredits = await User.aggregate([
      { $group: { _id: null, avg: { $avg: '$creditCount' } } }
    ]);

    // Count users with bonus discount (must have 5+ referral codes used)
    const usersWithDiscount = await User.countDocuments({
      promoCodeCount: { $gte: 5 }
    });

    res.json({
      totalUsers,
      totalEssays,
      totalLetters,
      totalCredits: totalCredits[0]?.total || 0,
      avgCredits: avgCredits[0]?.avg || 0,
      usersWithDiscount,
      bandDistribution: bandDistribution.map(item => ({
        band: item._id,
        count: item.count
      })),
      cefrDistribution: cefrDistribution.map(item => ({
        level: item._id,
        count: item.count
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = search
      ? { username: { $regex: search, $options: 'i' } }
      : {};

    const users = await User.find(query)
      .select('-tempQuestionText -tempQuestionPhotoId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserDetail = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const essays = await Essay.find({ userId }).sort({ createdAt: -1 });

    // Only average numeric band scores (essays), ignore CEFR string levels (letters)
    const numericEssays = essays.filter(e => typeof e.finalBand === 'number');

    res.json({
      user,
      essays,
      stats: {
        essaysCount: essays.filter(e => e.type !== 'letter').length,
        lettersCount: essays.filter(e => e.type === 'letter').length,
        totalCredits: user.creditCount,
        avgBand: numericEssays.length > 0
          ? (numericEssays.reduce((sum, e) => sum + (e.finalBand || 0), 0) / numericEssays.length).toFixed(2)
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEssays = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const userId = req.query.userId || null;
    const minBand = req.query.minBand ? parseFloat(req.query.minBand) : null;
    const maxBand = req.query.maxBand ? parseFloat(req.query.maxBand) : null;

    let query = {};
    if (userId) query.userId = userId;
    // Support filtering by type ('essay' or 'letter')
    if (req.query.type) query.type = req.query.type;
    if (minBand || maxBand) {
      query.finalBand = {};
      if (minBand) query.finalBand.$gte = minBand;
      if (maxBand) query.finalBand.$lte = maxBand;
    }

    const essays = await Essay.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Fetch user data for all essays
    const essaysWithUserInfo = await Promise.all(
      essays.map(async (essay) => {
        const user = await User.findOne({ userId: essay.userId }).lean();
        return {
          ...essay,
          username: user?.username || 'Unknown',
          userChatId: user?.userId
        };
      })
    );

    const total = await Essay.countDocuments(query);

    res.json({
      essays: essaysWithUserInfo,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEssayDetail = async (req, res) => {
  try {
    const { essayId } = req.params;

    const essay = await Essay.findById(essayId);
    if (!essay) {
      return res.status(404).json({ error: 'Essay not found' });
    }

    const user = await User.findOne({ userId: essay.userId });

    res.json({
      essay,
      user: {
        username: user?.username,
        userId: user?.userId,
        language: user?.selectedLanguage
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const broadcast = async (req, res) => {
  const { message, recipients, recipientType } = req.body;

  if (!message || !recipientType) {
    return res.status(400).json({ error: 'Message and recipientType required' });
  }

  try {
    let userIds = [];

    switch (recipientType) {
      case 'all':
        userIds = (await User.find().select('userId')).map(u => u.userId);
        break;
      case 'specific':
        userIds = recipients || [];
        break;
      case 'language':
        const language = req.body.language;
        userIds = (await User.find({ selectedLanguage: language }).select('userId')).map(u => u.userId);
        break;
      case 'creditRange':
        const minCredit = req.body.minCredit || 0;
        const maxCredit = req.body.maxCredit || 999;
        userIds = (await User.find({
          creditCount: { $gte: minCredit, $lte: maxCredit }
        }).select('userId')).map(u => u.userId);
        break;
      default:
        return res.status(400).json({ error: 'Invalid recipientType' });
    }

    if (!userIds.length) {
      return res.json({ success: true, sent: 0, failed: 0, errors: [] });
    }

    const bot = req.app.locals.bot;
    if (!bot) {
      return res.status(500).json({ error: 'Bot instance not available' });
    }

    let sent = 0;
    let failed = 0;
    const errors = [];

    for (const userId of userIds) {
      try {
        const chatId = parseInt(userId);
        
        if (isNaN(chatId)) {
          failed++;
          errors.push({ userId, error: 'Invalid user ID format' });
          continue;
        }

        await bot.telegram.sendMessage(chatId, message, { parse_mode: 'HTML' });
        sent++;
      } catch (error) {
        failed++;
        const errorMsg = error.response?.description || error.message || 'Unknown error';
        errors.push({ userId, error: errorMsg });
        console.error(`Failed to send message to ${userId}:`, errorMsg);
      }
    }

    res.json({ success: true, sent, failed, total: userIds.length, errors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserCredits = async (req, res) => {
  try {
    const { userId } = req.params;
    const { creditCount } = req.body;

    if (creditCount === undefined || creditCount < 0) {
      return res.status(400).json({ error: 'Invalid credit count' });
    }

    const user = await User.findOneAndUpdate(
      { userId },
      { creditCount },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
