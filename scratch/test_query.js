require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const PropertySchema = new mongoose.Schema({}, { strict: false, collection: 'items' });
const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

async function test() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');
    const id = "6a0ac2db282b28c832c6a76d";
    const prop = await Property.findById(id);
    console.log('Found by findById:', prop ? prop.title : 'NULL');
    const prop2 = await Property.findOne({ _id: new mongoose.Types.ObjectId(id) });
    console.log('Found by findOne ObjectId:', prop2 ? prop2.title : 'NULL');
    const prop3 = await Property.findOne({ _id: id });
    console.log('Found by findOne string:', prop3 ? prop3.title : 'NULL');
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
