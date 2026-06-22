import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Admin from './models/Admin.js';

dotenv.config();

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    const adminUsername = process.argv[2] || 'IdentityNull';
    const adminEmail = process.argv[3] || 'a6u6akir0414@gmail.com';
    const adminPassword = process.argv[4] || 'painintheassman';

    console.log('\n📝 Creating admin account with:');
    console.log(`   Username: ${adminUsername}`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);

    const existingAdmin = await Admin.findOne({ username: adminUsername });
    if (existingAdmin) {
      console.log('\n⚠️  Admin with this username already exists!');
      process.exit(0);
    }

    const admin = new Admin({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      role: 'super_admin',
      isActive: true
    });

    await admin.save();

    console.log('\n✅ Admin account created successfully!');
    console.log('\n🔐 You can now login to the admin panel with:');
    console.log(`   Username: ${adminUsername}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n💡 Tip: Change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

console.log('\n🚀 Admin Account Seeder\n');
console.log('Usage: node seed.js [username] [email] [password]');
console.log('Example: node seed.js admin admin@example.com mypassword123\n');

seedAdmin();
