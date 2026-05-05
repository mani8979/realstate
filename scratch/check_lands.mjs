import dbConnect from './src/lib/db';
import Property from './src/lib/models/Property';

async function checkLands() {
  try {
    await dbConnect();
    const count = await Property.countDocuments({ type: 'Plot' });
    console.log('Plot count:', count);
    const lands = await Property.find({ type: 'Plot' }).limit(20);
    console.log('Lands:', lands.length);
  } catch (error) {
    console.error(error);
  }
}

checkLands();
