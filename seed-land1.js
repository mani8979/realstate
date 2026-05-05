require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env.local");
  process.exit(1);
}

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    subType: { type: String },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    area: { type: String },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    featured: { type: Boolean, default: false },
  },
  { collection: 'items' }
);

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

const land1 = {
  title: "Lendy Pink Valley",
  price: 5000,
  location: "Vepada",
  type: "Farm Land",
  description: `Name: Lendy Pink Valley
Place: Vepada
Price: ₹5000 per square yard

Land Type
Farm land where fruit cultivation (dragon fruit) is actively done.
However, the plantation can be removed anytime and the land can be made ready immediately for residential or any other use as per the client’s requirement.

Total Land Area
10 Acres
Phase 1: 6.5 acres – Sold
Phase 2: 3.5 acres – Selling

Location Advantages
- Located at Vepada Mandal Headquarters
- Just 500 meters from MRO Office
- Close to Police Station
- Near Veterinary Hospital
- Developing area with increasing residential and commercial activity

Distance
Gajuwaka – 52 KM

Nearest Highway
Araku–Visakhapatnam Road – 8.5 KM from the site

Venture Features
- 20 ft & 24 ft internal roads
- Guest house facility
- Compound fencing
- Solar lighting
- Drip irrigation system
- 18 years free land maintenance
- Profit sharing (from the yield of dragon fruits crop): 50% to the company and 50% to the client
- Layout designed as per Vastu
- Clear title property

About Vepada – A Growing Location
Vepada is rapidly developing as a mandal headquarters and serves as an administrative hub for around 18 nearby villages. This makes it an important center for local governance, trade, and daily needs. With improving infrastructure, road connectivity, and availability of essential facilities, Vepada is seeing steady growth in real estate demand. Due to this development trend, land prices are expected to appreciate significantly, making it a smart investment choice for both residential and agricultural purposes.

Dragon Fruit Plantation & Profit Model
Dragon fruit cultivation is a high-demand and profitable farming option with long-term benefits.
Plantation Details (Per 100 Sq. Yards):
- 40 dragon fruit plants
- 4 plants per pole
- 10 poles in each 100 sq. yards

Plantation Period:
- Ideal season: May to November (approx.)

Dragon fruit plants can yield fruits for up to 30 years, providing long-term income stability. The produce generated will be sold, and the profits will be shared as per the model mentioned above.
This model ensures:
- Land ownership
- Continuous agricultural income
- Long-term asset appreciation
Additionally, the plantation can be removed anytime if the client wishes to convert the land for residential or other purposes.`,
  images: ["/luxury_villa_hero_1777953581914.png"],
  area: "10 Acres",
  featured: true
};

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Check if it already exists
    const existing = await Property.findOne({ title: "Lendy Pink Valley" });
    if (existing) {
      console.log('Property already exists. Updating...');
      await Property.updateOne({ _id: existing._id }, land1);
      console.log('Updated successfully.');
    } else {
      console.log('Inserting property...');
      await Property.create(land1);
      console.log('Inserted successfully.');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();
