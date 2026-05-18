// scratch/backup_local.js
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const mongoose = require('mongoose');

const mongoUri = "mongodb://kallabhavani202_db_user:l6PoKzZQRH6zstja@ac-6ocskhm-shard-00-00.t9papjs.mongodb.net:27017,ac-6ocskhm-shard-00-01.t9papjs.mongodb.net:27017,ac-6ocskhm-shard-00-02.t9papjs.mongodb.net:27017/merncurd?ssl=true&replicaSet=atlas-kv13m6-shard-0&authSource=admin&appName=Cluster0";

async function backup() {
  const sessionDir = path.join(__dirname, '..', '.wwebjs_auth');
  if (!fs.existsSync(sessionDir)) {
    console.error('❌ Error: Local session folder (.wwebjs_auth) not found! Please run your local server first.');
    return;
  }

  // Define paths to delete programmatically to shrink the session size
  const pathsToDelete = [
    path.join(sessionDir, 'session', 'BrowserMetrics-spare.pma'),
    path.join(sessionDir, 'session', 'Crashpad'),
    path.join(sessionDir, 'session', 'Default', 'Cache'),
    path.join(sessionDir, 'session', 'Default', 'Code Cache'),
    path.join(sessionDir, 'session', 'Default', 'GPUCache'),
    path.join(sessionDir, 'session', 'Default', 'Service Worker'),
    path.join(sessionDir, 'session', 'Default', 'IndexedDB', 'https_web.whatsapp.com_0.indexeddb.blob'),
  ];

  console.log('[Local Sync] Cleaning non-essential Chrome cache folders to shrink package...');
  for (const p of pathsToDelete) {
    try {
      if (fs.existsSync(p)) {
        console.log(`Deleting: ${p}`);
        fs.rmSync(p, { recursive: true, force: true });
      }
    } catch (e) {
      console.warn(`Could not delete ${p}: ${e.message}`);
    }
  }

  const tempFile = path.join(os.tmpdir(), 'local_wa_session.tar.gz');
  try {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }

    console.log(`[Local Sync] Archiving clean session folder to ${tempFile}...`);
    const tarCmd = `tar -czf "${tempFile}" -C "${sessionDir}" .`;
    execSync(tarCmd, { stdio: 'inherit' });

    if (!fs.existsSync(tempFile)) {
      throw new Error('Tar archive creation failed.');
    }

    const archiveBuffer = fs.readFileSync(tempFile);
    console.log(`[Local Sync] Cleaned compressed archive size: ${archiveBuffer.length} bytes.`);

    console.log('Connecting to production MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected successfully!');

    const collection = mongoose.connection.collection('whatsapp_sessions');
    await collection.updateOne(
      { key: 'session_archive' },
      { $set: { data: archiveBuffer.toString('base64'), updatedAt: new Date() } },
      { upsert: true }
    );
    console.log('✅ Success! Local session successfully uploaded to production MongoDB database.');
  } catch (e) {
    console.error('❌ Failed to backup session:', e.message);
  } finally {
    try {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    } catch (_) {}
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
}

backup();
