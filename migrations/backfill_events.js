import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Essay from '../models/Essay.js';
import EventLog from '../models/EventLog.js';

async function backfillEvents() {
  try {
    console.log('🔄 Starting backfill migration...');
    await connectDB();

    // Check if events already exist
    const existingEventCount = await EventLog.countDocuments();
    if (existingEventCount > 0) {
      console.log(`✅ EventLog already has ${existingEventCount} events. Skipping backfill.`);
      process.exit(0);
    }

    // 1. Create USER_STARTED_BOT events from User documents
    console.log('📝 Creating USER_STARTED_BOT events...');
    const users = await User.find({}).lean();
    let startBotCount = 0;

    for (const user of users) {
      await EventLog.create({
        userId: user.userId,
        eventType: 'USER_STARTED_BOT',
        campaignId: null,
        referralSource: null,
        timestamp: user.createdAt || new Date()
      });
      startBotCount++;
    }
    console.log(`✅ Created ${startBotCount} USER_STARTED_BOT events`);

    // 2. Create FIRST_ESSAY_SUBMITTED and SECOND_ESSAY_SUBMITTED events
    console.log('📝 Creating essay submission events...');
    const essays = await Essay.find({}).sort({ createdAt: 1 }).lean();
    const essaysByUser = {};

    // Group essays by user
    for (const essay of essays) {
      if (!essaysByUser[essay.userId]) {
        essaysByUser[essay.userId] = [];
      }
      essaysByUser[essay.userId].push(essay);
    }

    let firstEssayCount = 0;
    let secondEssayCount = 0;

    // Create events for first and second essays
    for (const [userId, userEssays] of Object.entries(essaysByUser)) {
      if (userEssays.length >= 1) {
        await EventLog.create({
          userId,
          eventType: 'FIRST_ESSAY_SUBMITTED',
          metadata: { essayId: userEssays[0]._id.toString() },
          timestamp: userEssays[0].createdAt || new Date()
        });
        firstEssayCount++;
      }

      if (userEssays.length >= 2) {
        await EventLog.create({
          userId,
          eventType: 'SECOND_ESSAY_SUBMITTED',
          metadata: { essayId: userEssays[1]._id.toString() },
          timestamp: userEssays[1].createdAt || new Date()
        });
        secondEssayCount++;
      }
    }

    console.log(`✅ Created ${firstEssayCount} FIRST_ESSAY_SUBMITTED events`);
    console.log(`✅ Created ${secondEssayCount} SECOND_ESSAY_SUBMITTED events`);

    // 3. Summary
    const totalEvents = startBotCount + firstEssayCount + secondEssayCount;
    console.log(`\n✅ Backfill complete! Created ${totalEvents} total events.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Backfill migration failed:', error);
    process.exit(1);
  }
}

backfillEvents();
