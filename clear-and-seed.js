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
    details: { type: Object } // Store structured details for the new page
  },
  { collection: 'items', strict: false }
);

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

const lendyData = {
  title: "Lendy Pink Valley",
  price: 5000, // per sq yard
  location: "Vepada",
  type: "Farm Land",
  area: "10 Acres",
  featured: true,
  images: ["/luxury_villa_hero_1777953581914.png"],
  description: "Farm land where fruit cultivation (dragon fruit) is actively done. However, the plantation can be removed anytime and the land can be made ready immediately for residential or any other use as per the client’s requirement.",
  details: [
    {
      heading: "Land Type",
      content: "Farm land where fruit cultivation (dragon fruit) is actively done.\nHowever, the plantation can be removed anytime and the land can be made ready immediately for residential or any other use as per the client’s requirement."
    },
    {
      heading: "Total Land Area",
      content: "10 Acres\n\nPhase 1: 6.5 acres – Sold\nPhase 2: 3.5 acres – Selling",
      subHeadings: ["Phase 1: 6.5 acres – Sold", "Phase 2: 3.5 acres – Selling"]
    },
    {
      heading: "Location Advantages",
      content: "Located at Vepada Mandal Headquarters\nJust 500 meters from MRO Office\nClose to Police Station\nNear Veterinary Hospital\nDeveloping area with increasing residential and commercial activity"
    },
    {
      heading: "Distance",
      content: "Gajuwaka – 52 KM"
    },
    {
      heading: "Nearest Highway",
      content: "Araku–Visakhapatnam Road – 8.5 KM from the site"
    },
    {
      heading: "Venture Features",
      content: "20 ft & 24 ft internal roads\nGuest house facility\nCompound fencing\nSolar lighting\nDrip irrigation system\n18 years free land maintenance\nProfit sharing (from the yield of dragon fruits crop): 50% to the company and 50% to the client\nLayout designed as per Vastu\nClear title property"
    },
    {
      heading: "About Vepada – A Growing Location",
      content: "Vepada is rapidly developing as a mandal headquarters and serves as an administrative hub for around 18 nearby villages. This makes it an important center for local governance, trade, and daily needs. With improving infrastructure, road connectivity, and availability of essential facilities, Vepada is seeing steady growth in real estate demand. Due to this development trend, land prices are expected to appreciate significantly, making it a smart investment choice for both residential and agricultural purposes."
    },
    {
      heading: "Dragon Fruit Plantation & Profit Model",
      content: "Dragon fruit cultivation is a high-demand and profitable farming option with long-term benefits.\n\nDragon fruit plants can yield fruits for up to 30 years, providing long-term income stability. The produce generated will be sold, and the profits will be shared as per the model mentioned above.\n\nAdditionally, the plantation can be removed anytime if the client wishes to convert the land for residential or other purposes.",
      subHeadings: [
        "Plantation Details (Per 100 Sq. Yards):",
        "40 dragon fruit plants\n4 plants per pole\n10 poles in each 100 sq. yards",
        "Plantation Period:",
        "Ideal season: May to November (approx.)",
        "This model ensures:",
        "Land ownership\nContinuous agricultural income\nLong-term asset appreciation"
      ]
    }
  ]
};

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    console.log('Removing all existing properties...');
    await Property.deleteMany({});
    
    console.log('Inserting Lendy Pink Valley...');
    await Property.create(lendyData);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();
