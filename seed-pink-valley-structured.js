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
    details: [{
      heading: String,
      content: String,
      sideHeading: String,
      showArrow: Boolean,
      isPointed: Boolean
    }],
    threeDElement: String
  },
  { collection: 'items' }
);

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

const pinkValley = {
  title: "Lendy Pink Valley",
  price: 5000,
  location: "Vepada",
  type: "Land",
  subType: "Farm Land",
  description: "Lendy Pink Valley is a premium farm land venture in Vepada with active dragon fruit cultivation.",
  images: ["/luxury_villa_hero_1777953581914.png"],
  area: "10 Acres",
  featured: true,
  details: [
    {
      heading: "Land Type",
      content: "Farm land where fruit cultivation (dragon fruit) is actively done.\nHowever, the plantation can be removed anytime and the land can be made ready immediately for residential or any other use as per the client’s requirement.",
      sideHeading: "Productive Asset",
      showArrow: true
    },
    {
      heading: "Total Land Area",
      content: "10 Acres\nPhase 1: 6.5 acres – Sold\nPhase 2: 3.5 acres – Selling",
      sideHeading: "Scale & Growth",
      showArrow: true
    },
    {
      heading: "Location Advantages",
      content: "Located at Vepada Mandal Headquarters\nJust 500 meters from MRO Office\nClose to Police Station\nNear Veterinary Hospital\nDeveloping area with increasing residential and commercial activity",
      sideHeading: "Prime Spot",
      showArrow: true,
      isPointed: true
    },
    {
      heading: "Connectivity",
      content: "Gajuwaka – 52 KM\nNearest Highway: Araku–Visakhapatnam Road – 8.5 KM from the site",
      sideHeading: "Distance Info"
    },
    {
      heading: "Venture Features",
      content: "20 ft & 24 ft internal roads\nGuest house facility\nCompound fencing\nSolar lighting\nDrip irrigation system\n18 years free land maintenance\nProfit sharing (from the yield of dragon fruits crop): 50% to the company and 50% to the client\nLayout designed as per Vastu\nClear title property",
      sideHeading: "Amenities",
      showArrow: true,
      isPointed: true
    },
    {
      heading: "About Vepada",
      content: "Vepada is rapidly developing as a mandal headquarters and serves as an administrative hub for around 18 nearby villages. This makes it an important center for local governance, trade, and daily needs. With improving infrastructure, road connectivity, and availability of essential facilities, Vepada is seeing steady growth in real estate demand. Due to this development trend, land prices are expected to appreciate significantly, making it a smart investment choice for both residential and agricultural purposes.",
      sideHeading: "Growing Hub"
    },
    {
      heading: "Dragon Fruit Plantation & Profit Model",
      content: "Dragon fruit cultivation is a high-demand and profitable farming option with long-term benefits.\nDragon fruit plants can yield fruits for up to 30 years, providing long-term income stability. The produce generated will be sold, and the profits will be shared as per the model mentioned above.\nAdditionally, the plantation can be removed anytime if the client wishes to convert the land for residential or other purposes.",
      sideHeading: "Passive Income"
    }
  ],
  threeDElement: "https://my.matterport.com/show/?m=7XNfP2vG6f1" // Example 3D model link
};

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Check if it already exists
    const existing = await Property.findOne({ title: "Lendy Pink Valley" });
    if (existing) {
      console.log('Property already exists. Updating with structured data...');
      await Property.updateOne({ _id: existing._id }, pinkValley);
      console.log('Updated successfully.');
    } else {
      console.log('Inserting property with structured data...');
      await Property.create(pinkValley);
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
