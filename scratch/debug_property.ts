import dbConnect from '../src/lib/db';
import Property from '../src/lib/models/Property';

async function test() {
  await dbConnect();
  const property = await Property.findById('6a015e21caf6395e908b80d5');
  console.log(JSON.stringify(property, null, 2));
  process.exit(0);
}

test();
