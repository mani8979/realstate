require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const PropertySchema = new mongoose.Schema({}, { strict: false, collection: 'items' });
const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

async function list() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');
    const properties = await Property.find({}, { _id: 1, title: 1, type: 1, landBrochure: 1 });
    console.log('Properties found:');
    properties.forEach(p => {
      console.log(`ID: ${p._id}, Title: ${p.title}, Type: ${p.type}, Brochure Pages: ${p.get('landBrochure') ? p.get('landBrochure').length : 0}`);
      if (p.get('landBrochure')) {
        console.log('  Pages:', p.get('landBrochure'));
      }
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

list();
