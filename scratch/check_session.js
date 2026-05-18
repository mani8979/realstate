// scratch/check_session.js
const mongoose = require('mongoose');

const mongoUri = "mongodb://kallabhavani202_db_user:l6PoKzZQRH6zstja@ac-6ocskhm-shard-00-00.t9papjs.mongodb.net:27017,ac-6ocskhm-shard-00-01.t9papjs.mongodb.net:27017,ac-6ocskhm-shard-00-02.t9papjs.mongodb.net:27017/merncurd?ssl=true&replicaSet=atlas-kv13m6-shard-0&authSource=admin&appName=Cluster0";

async function check() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected successfully!');
    
    const collection = mongoose.connection.collection('whatsapp_sessions');
    const doc = await collection.findOne({ key: 'session_archive' });
    if (!doc) {
      console.log('❌ No WhatsApp session archive found in MongoDB.');
    } else {
      console.log('✅ Found WhatsApp session archive!');
      console.log(`Updated At: ${doc.updatedAt}`);
      console.log(`Data length: ${doc.data ? doc.data.length : 0} bytes`);
    }
  } catch (e) {
    console.error('Error checking MongoDB:', e.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

check();
