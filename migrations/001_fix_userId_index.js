import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';

dotenv.config();

async function migrate() {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const collection = db.collection('users');

    console.log('Starting migration: Fix userId unique index...\n');

    // Step 1: Drop the old telegramId index if it exists
    console.log('Step 1: Dropping orphaned telegramId_1 index (if exists)...');
    try {
      await collection.dropIndex('telegramId_1');
      console.log('✓ Dropped telegramId_1 index\n');
    } catch (err) {
      if (err.message.includes('index not found')) {
        console.log('ℹ telegramId_1 index does not exist (already cleaned)\n');
      } else {
        throw err;
      }
    }

    // Step 2: Remove orphaned documents where both userId and telegramId are null/missing
    console.log('Step 2: Removing orphaned documents with null userId...');
    const deleteResult = await collection.deleteMany({
      $or: [
        { userId: null },
        { userId: { $exists: false } }
      ]
    });
    console.log(`✓ Deleted ${deleteResult.deletedCount} orphaned document(s)\n`);

    // Step 3: Recreate the unique index on userId
    console.log('Step 3: Ensuring unique index on userId...');
    await collection.createIndex({ userId: 1 }, { unique: true, sparse: false });
    console.log('✓ Unique index on userId created/verified\n');

    // Step 4: Verify the collection state
    console.log('Step 4: Verifying collection state...');
    const indexList = await collection.listIndexes().toArray();
    console.log('Current indexes:');
    indexList.forEach((idx) => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });
    const docCount = await collection.countDocuments();
    console.log(`\n✓ Total documents in collection: ${docCount}\n`);

    console.log('✅ Migration completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
