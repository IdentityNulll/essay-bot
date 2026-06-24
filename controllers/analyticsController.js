import EventLog from '../models/EventLog.js';
import Transaction from '../models/Transaction.js';
import Referral from '../models/Referral.js';
import Campaign from '../models/Campaign.js';
import User from '../models/User.js';

export const getOverviewCards = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const timestampFilter = Object.keys(dateFilter).length > 0 ? { timestamp: dateFilter } : {};

    // Total Users
    const totalUsers = await User.countDocuments();

    // New Users (in date range)
    let newUsersCount = 0;
    if (Object.keys(timestampFilter).length > 0) {
      newUsersCount = await EventLog.countDocuments({
        eventType: 'USER_STARTED_BOT',
        ...timestampFilter
      });
    } else {
      newUsersCount = await EventLog.countDocuments({
        eventType: 'USER_STARTED_BOT'
      });
    }

    // Today's new users
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await EventLog.countDocuments({
      eventType: 'USER_STARTED_BOT',
      timestamp: { $gte: today }
    });

    // Total Essay Checks
    const totalEssayChecks = await EventLog.countDocuments({
      eventType: { $in: ['FIRST_ESSAY_SUBMITTED', 'SECOND_ESSAY_SUBMITTED'] },
      ...timestampFilter
    });

    // Total Revenue (from approved transactions)
    const revenueResult = await Transaction.aggregate([
      {
        $match: {
          status: 'APPROVED',
          ...(Object.keys(timestampFilter).length > 0 ? timestampFilter : {})
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Total Purchases
    const totalPurchases = await EventLog.countDocuments({
      eventType: 'PACKAGE_PURCHASED',
      ...timestampFilter
    });

    // Total Referrals
    const totalReferrals = await EventLog.countDocuments({
      eventType: 'REFERRAL_GENERATED',
      ...timestampFilter
    });

    res.json({
      totalUsers,
      newUsers: newUsersCount,
      newUsersToday,
      totalEssayChecks,
      totalRevenue,
      totalPurchases,
      totalReferrals
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getConversionFunnel = async (req, res) => {
  try {
    const { startDate, endDate, campaignId } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const baseMatch = {
      ...(Object.keys(dateFilter).length > 0 ? { timestamp: dateFilter } : {}),
      ...(campaignId ? { campaignId } : {})
    };

    // Get unique user counts for each stage
    const stage1 = await EventLog.distinct('userId', {
      ...baseMatch,
      eventType: 'USER_STARTED_BOT'
    });

    const stage2 = await EventLog.distinct('userId', {
      ...baseMatch,
      eventType: 'FIRST_ESSAY_SUBMITTED'
    });

    const stage3 = await EventLog.distinct('userId', {
      ...baseMatch,
      eventType: 'SECOND_ESSAY_SUBMITTED'
    });

    const stage4 = await EventLog.distinct('userId', {
      ...baseMatch,
      eventType: 'PAYMENT_PAGE_VIEWED'
    });

    const stage5 = await EventLog.distinct('userId', {
      ...baseMatch,
      eventType: 'PACKAGE_PURCHASED'
    });

    const stages = [
      { name: 'Users Started Bot', count: stage1.length, dropoff: 0, conversion: 100 },
      {
        name: 'Submitted First Essay',
        count: stage2.length,
        dropoff: stage1.length > 0 ? ((stage1.length - stage2.length) / stage1.length * 100).toFixed(2) : 0,
        conversion: stage1.length > 0 ? (stage2.length / stage1.length * 100).toFixed(2) : 0
      },
      {
        name: 'Submitted Second Essay',
        count: stage3.length,
        dropoff: stage2.length > 0 ? ((stage2.length - stage3.length) / stage2.length * 100).toFixed(2) : 0,
        conversion: stage1.length > 0 ? (stage3.length / stage1.length * 100).toFixed(2) : 0
      },
      {
        name: 'Viewed Payment Page',
        count: stage4.length,
        dropoff: stage3.length > 0 ? ((stage3.length - stage4.length) / stage3.length * 100).toFixed(2) : 0,
        conversion: stage1.length > 0 ? (stage4.length / stage1.length * 100).toFixed(2) : 0
      },
      {
        name: 'Purchased Package',
        count: stage5.length,
        dropoff: stage4.length > 0 ? ((stage4.length - stage5.length) / stage4.length * 100).toFixed(2) : 0,
        conversion: stage1.length > 0 ? (stage5.length / stage1.length * 100).toFixed(2) : 0
      }
    ];

    res.json({ stages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCampaignMetrics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const timestampFilter = Object.keys(dateFilter).length > 0 ? { timestamp: dateFilter } : {};

    // Get all campaigns
    const campaigns = await Campaign.find({}).lean();

    const campaignMetrics = await Promise.all(
      campaigns.map(async (campaign) => {
        // Users acquired from this campaign
        const usersAcquired = await EventLog.distinct('userId', {
          eventType: 'USER_STARTED_BOT',
          campaignId: campaign.campaignId,
          ...timestampFilter
        });

        // Purchases from campaign users
        const purchasesResult = await Transaction.countDocuments({
          userId: { $in: usersAcquired },
          status: 'APPROVED',
          ...(Object.keys(timestampFilter).length > 0 ? timestampFilter : {})
        });

        // Revenue from campaign users
        const revenueResult = await Transaction.aggregate([
          {
            $match: {
              userId: { $in: usersAcquired },
              status: 'APPROVED',
              ...(Object.keys(timestampFilter).length > 0 ? timestampFilter : {})
            }
          },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const revenue = revenueResult[0]?.total || 0;

        const costPerUser = usersAcquired.length > 0 ? (campaign.cost / usersAcquired.length).toFixed(2) : 0;
        const roi = campaign.cost > 0 ? (((revenue - campaign.cost) / campaign.cost) * 100).toFixed(2) : 0;

        return {
          campaignName: campaign.campaignName,
          campaignId: campaign.campaignId,
          source: campaign.source,
          cost: campaign.cost,
          usersAcquired: usersAcquired.length,
          costPerUser,
          purchases: purchasesResult,
          revenue,
          roi
        };
      })
    );

    res.json({ campaigns: campaignMetrics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReferralAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const timestampFilter = Object.keys(dateFilter).length > 0 ? { timestamp: dateFilter } : {};

    // Total referral links generated
    const totalLinksGenerated = await EventLog.countDocuments({
      eventType: 'REFERRAL_GENERATED',
      ...timestampFilter
    });

    // Successful referrals (users who made purchase)
    const referralEvents = await EventLog.find({
      eventType: 'REFERRAL_GENERATED',
      ...timestampFilter
    }).lean();

    const referredUserIds = referralEvents.map(e => e.metadata?.referredUserId).filter(Boolean);
    const successfulReferrals = await EventLog.countDocuments({
      eventType: 'PACKAGE_PURCHASED',
      userId: { $in: referredUserIds },
      ...timestampFilter
    });

    const referralConversionRate = totalLinksGenerated > 0
      ? (successfulReferrals / totalLinksGenerated * 100).toFixed(2)
      : 0;

    // Top referrers
    const topReferrers = await EventLog.aggregate([
      {
        $match: {
          eventType: 'REFERRAL_GENERATED',
          ...timestampFilter
        }
      },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get user info for top referrers
    const topReferrersWithInfo = await Promise.all(
      topReferrers.map(async (referrer) => {
        const user = await User.findOne({ userId: referrer._id }).lean();
        const revenue = await Transaction.aggregate([
          {
            $match: {
              userId: referrer._id,
              status: 'APPROVED'
            }
          },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        return {
          userId: referrer._id,
          username: user?.username || 'Unknown',
          referralCount: referrer.count,
          totalRevenue: revenue[0]?.total || 0
        };
      })
    );

    res.json({
      totalLinksGenerated,
      successfulReferrals,
      referralConversionRate,
      topReferrers: topReferrersWithInfo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getChartData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const timestampFilter = Object.keys(dateFilter).length > 0 ? { timestamp: dateFilter } : {};

    // Daily New Users
    const dailyNewUsers = await EventLog.aggregate([
      {
        $match: {
          eventType: 'USER_STARTED_BOT',
          ...timestampFilter
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Daily Revenue
    const dailyRevenue = await Transaction.aggregate([
      {
        $match: {
          status: 'APPROVED',
          ...(Object.keys(timestampFilter).length > 0 ? timestampFilter : {})
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Daily Purchases
    const dailyPurchases = await EventLog.aggregate([
      {
        $match: {
          eventType: 'PACKAGE_PURCHASED',
          ...timestampFilter
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Daily Essay Checks
    const dailyEssayChecks = await EventLog.aggregate([
      {
        $match: {
          eventType: { $in: ['FIRST_ESSAY_SUBMITTED', 'SECOND_ESSAY_SUBMITTED'] },
          ...timestampFilter
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      dailyNewUsers: dailyNewUsers.map(d => ({ date: d._id, value: d.count })),
      dailyRevenue: dailyRevenue.map(d => ({ date: d._id, value: d.total })),
      dailyPurchases: dailyPurchases.map(d => ({ date: d._id, value: d.count })),
      dailyEssayChecks: dailyEssayChecks.map(d => ({ date: d._id, value: d.count }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({}).sort({ createdAt: -1 });
    res.json({ campaigns });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCampaign = async (req, res) => {
  try {
    const { campaignName, cost, source, startDate, endDate } = req.body;

    if (!campaignName || cost === undefined || !source || !startDate) {
      return res.status(400).json({ error: 'campaignName, cost, source, and startDate are required' });
    }

    const campaignId = `${source}_${Date.now()}`;

    const campaign = await Campaign.create({
      campaignId,
      campaignName,
      cost,
      source,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null
    });

    res.json({ campaign });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { campaignName, cost, endDate } = req.body;

    const campaign = await Campaign.findOneAndUpdate(
      { campaignId },
      {
        ...(campaignName && { campaignName }),
        ...(cost !== undefined && { cost }),
        ...(endDate && { endDate: new Date(endDate) })
      },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ campaign });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findOneAndDelete({ campaignId });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ success: true, message: 'Campaign deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
