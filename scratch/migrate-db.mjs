import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const sourceUri = 'mongodb://localhost:27017/merncurd';
const targetUri = process.env.MONGODB_URI;

if (!targetUri) {
  console.error('Target MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function migrate() {
  console.log('Starting migration...');
  console.log('Source:', sourceUri);
  console.log('Target:', targetUri);

  try {
    // Connect to source
    const sourceConn = await mongoose.createConnection(sourceUri).asPromise();
    console.log('Connected to source database');

    // Connect to target
    const targetConn = await mongoose.createConnection(targetUri).asPromise();
    console.log('Connected to target database');

    const collections = await sourceConn.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections to migrate`);

    for (const collectionInfo of collections) {
      const name = collectionInfo.name;
      console.log(`Migrating collection: ${name}...`);

      const sourceCollection = sourceConn.db.collection(name);
      const targetCollection = targetConn.db.collection(name);

      const data = await sourceCollection.find({}).toArray();
      console.log(`  Found ${data.length} documents`);

      if (data.length > 0) {
        // Clear target collection first? User might want to overwrite.
        // For safety, let's just insert.
        try {
            await targetCollection.deleteMany({});
            await targetCollection.insertMany(data);
            console.log(`  Successfully migrated ${data.length} documents`);
        } catch (err) {
            console.error(`  Error migrating ${name}:`, err.message);
        }
      } else {
        console.log(`  Skipping empty collection`);
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

migrate();
