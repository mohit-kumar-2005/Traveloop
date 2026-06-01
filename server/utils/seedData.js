import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import City from '../models/City.js';
import Activity from '../models/Activity.js';
import Trip from '../models/Trip.js';
import Stop from '../models/Stop.js';
import Budget from '../models/Budget.js';

dotenv.config();

const unsplash = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

const citySeeds = [
  ['Paris', 'France', 'Europe', 'Iconic art, cuisine, and riverside charm.', 4, 98, '1511730728647-cbfdfda21abb', 48.8566, 2.3522],
  ['Tokyo', 'Japan', 'Asia', 'Neon skylines and timeless temples.', 5, 95, '1540959733332-eab4deabeeaf', 35.6762, 139.6503],
  ['New York', 'United States', 'Americas', 'The city that never sleeps.', 5, 99, '1496442226666-8d4d0fed62d6', 40.7128, -74.006],
  ['London', 'United Kingdom', 'Europe', 'Royal history and world-class museums.', 5, 96, '1513635269976-596e144be48d', 51.5074, -0.1278],
  ['Rome', 'Italy', 'Europe', 'Ancient ruins and Italian dolce vita.', 4, 94, '1552832230-c0197ed31122', 41.9028, 12.4964],
  ['Barcelona', 'Spain', 'Europe', 'Gaudi architecture and Mediterranean beaches.', 4, 92, '1583422305262-289e01e8f5f4', 41.3851, 2.1734],
  ['Dubai', 'United Arab Emirates', 'Asia', 'Futuristic skyline and desert adventures.', 5, 90, '1512453979798-5ea266f8880c', 25.2048, 55.2708],
  ['Singapore', 'Singapore', 'Asia', 'Garden city with hawker culture.', 5, 91, '1525625293386-9f8f4f6e6d8e', 1.3521, 103.8198],
  ['Sydney', 'Australia', 'Oceania', 'Harbor icons and coastal walks.', 4, 89, '1506905925346-21bda4d32df4', -33.8688, 151.2093],
  ['Los Angeles', 'United States', 'Americas', 'Entertainment capital with endless sunshine.', 4, 93, '1477959852674-cb16e8d6b8e6', 34.0522, -118.2437],
  ['Berlin', 'Germany', 'Europe', 'Creative energy and layered history.', 3, 87, '1560969184-10e20e17ed88', 52.52, 13.405],
  ['Amsterdam', 'Netherlands', 'Europe', 'Canals, bikes, and cozy cafes.', 4, 88, '1583422305262-289e01e8f5f4', 52.3676, 4.9041],
  ['Prague', 'Czech Republic', 'Europe', 'Fairytale Old Town and bridges.', 3, 85, '1541849546-216549ae23cc', 50.0755, 14.4378],
  ['Vienna', 'Austria', 'Europe', 'Classical music and imperial palaces.', 4, 84, '1516550897923-b038574f9ac8', 48.2082, 16.3738],
  ['Lisbon', 'Portugal', 'Europe', 'Hills, tiles, and Atlantic breezes.', 3, 86, '1585208798855-8ac01ddbe20e', 38.7223, -9.1393],
  ['Istanbul', 'Turkey', 'Europe', 'Continents meet at the Bosphorus.', 3, 90, '1524231757918-e36db07ca64e', 41.0082, 28.9784],
  ['Cairo', 'Egypt', 'Africa', 'Pyramids and Nile-side bustle.', 2, 82, '1572252009287-c15224f57dd9', 30.0444, 31.2357],
  ['Marrakech', 'Morocco', 'Africa', 'Souks, riads, and desert gateways.', 3, 83, '1597216269216-bb8f3f7e8c5e', 31.6295, -7.9811],
  ['Cape Town', 'South Africa', 'Africa', 'Table Mountain and wine routes.', 3, 84, '1580060839136-5f7f4f4e7e8e', -33.9249, 18.4241],
  ['Nairobi', 'Kenya', 'Africa', 'Safari hub with vibrant markets.', 2, 78, '1516026676097-d45f9f9f7e8e', -1.2921, 36.8219],
  ['Bangkok', 'Thailand', 'Asia', 'Temples, street food, and river life.', 2, 94, '1563492065599-b3520da27644', 13.7563, 100.5018],
  ['Hong Kong', 'Hong Kong', 'Asia', 'Harbor views and dim sum.', 5, 92, '1536599019556-cf9f8f6f9f9f', 22.3193, 114.1694],
  ['Seoul', 'South Korea', 'Asia', 'K-culture, cuisine, and nightlife.', 4, 91, '1517153907287-d8677e9acdd8', 37.5665, 126.978],
  ['Beijing', 'China', 'Asia', 'Great Wall access and imperial heritage.', 3, 89, '1508805875877-d03bad885bdd', 39.9042, 116.4074],
  ['Shanghai', 'China', 'Asia', 'Pudong skyline and historic Bund.', 4, 90, '1548919665-fd8f28ed17f8', 31.2304, 121.4737],
  ['Mumbai', 'India', 'Asia', 'Bollywood energy and coastal contrasts.', 3, 88, '1566556229258-df9f9f9f9f9f', 19.076, 72.8777],
  ['Delhi', 'India', 'Asia', 'Mughal monuments and spice markets.', 2, 87, '1587474260544-bf8f9f9f9f9f', 28.6139, 77.209],
  ['Melbourne', 'Australia', 'Oceania', 'Laneways, coffee, and sports.', 4, 86, '1514395466925-b115020e8f9f', -37.8136, 144.9631],
  ['Auckland', 'New Zealand', 'Oceania', 'Harbor city near geothermal wonders.', 3, 82, '1507699629817-cf8f9f9f9f9f', -36.8485, 174.7633],
  ['Toronto', 'Canada', 'Americas', 'Multicultural neighborhoods on Lake Ontario.', 4, 88, '1517935705926-8f6f9f9f9f9f', 43.6532, -79.3832],
  ['Vancouver', 'Canada', 'Americas', 'Mountains meet the Pacific.', 4, 87, '1559827260-dc66d52bef47', 49.2827, -123.1207],
  ['Mexico City', 'Mexico', 'Americas', 'Aztec roots and creative cuisine.', 2, 85, '1518107616936-f9f9f9f9f9f9', 19.4326, -99.1332],
  ['Rio de Janeiro', 'Brazil', 'Americas', 'Beaches, samba, and Sugarloaf views.', 3, 91, '1483729558449-f9f9f9f9f9f9', -22.9068, -43.1729],
  ['Buenos Aires', 'Argentina', 'Americas', 'Tango, steak, and Parisian avenues.', 3, 84, '1589909206398-f9f9f9f9f9f9', -34.6037, -58.3816],
  ['Lima', 'Peru', 'Americas', 'Coastal capital gateway to Machu Picchu.', 2, 80, '1587599288148-f9f9f9f9f9f9', -12.0464, -77.0428],
  ['Chicago', 'United States', 'Americas', 'Architecture river tours and deep dish.', 4, 86, '1477959852674-f9f9f9f9f9f9', 41.8781, -87.6298],
  ['San Francisco', 'United States', 'Americas', 'Golden Gate and tech innovation.', 5, 93, '1501594903896-f9f9f9f9f9f9', 37.7749, -122.4194],
  ['Miami', 'United States', 'Americas', 'Art deco beaches and nightlife.', 4, 88, '1506905925346-f9f9f9f9f9f9', 25.7617, -80.1918],
  ['Edinburgh', 'United Kingdom', 'Europe', 'Castle rock and festival city.', 4, 83, '1506905925346-f9f9f9f9f9f9', 55.9533, -3.1883],
  ['Dublin', 'Ireland', 'Europe', 'Literary pubs and Georgian streets.', 4, 82, '1549880188-f9f9f9f9f9f9', 53.3498, -6.2603],
  ['Stockholm', 'Sweden', 'Europe', 'Island archipelago and Nordic design.', 5, 81, '1506929562872-f9f9f9f9f9f9', 59.3293, 18.0686],
  ['Oslo', 'Norway', 'Europe', 'Fjords nearby and modern museums.', 5, 79, '1513626120522-f9f9f9f9f9f9', 59.9139, 10.7522],
  ['Helsinki', 'Finland', 'Europe', 'Sauna culture and design district.', 4, 78, '1559827260-f9f9f9f9f9f9', 60.1699, 24.9384],
  ['Warsaw', 'Poland', 'Europe', 'Rebuilt Old Town and pierogi.', 2, 76, '1559827260-f9f9f9f9f9f9', 52.2297, 21.0122],
  ['Athens', 'Greece', 'Europe', 'Ancient Acropolis and island ferries.', 3, 87, '1555996674-f9f9f9f9f9f9', 37.9838, 23.7275],
  ['Reykjavik', 'Iceland', 'Europe', 'Northern lights and geothermal pools.', 5, 77, '1504893535458-f9f9f9f9f9f9', 64.1466, -21.9426],
  ['Zurich', 'Switzerland', 'Europe', 'Alpine trains and lakeside calm.', 5, 80, '1516026676097-f9f9f9f9f9f9', 47.3769, 8.5417],
  ['Brussels', 'Belgium', 'Europe', 'Chocolate, beer, and EU capital.', 4, 79, '1558618666-f9f9f9f9f9f9', 50.8503, 4.3517],
  ['Copenhagen', 'Denmark', 'Europe', 'Hygge, cycling, and Nyhavn.', 5, 83, '1513625260522-f9f9f9f9f9f9', 55.6761, 12.5683],
  ['Hanoi', 'Vietnam', 'Asia', 'Old Quarter chaos and pho stalls.', 2, 86, '1528181301324-f9f9f9f9f9f9', 21.0285, 105.8542],
  ['Kuala Lumpur', 'Malaysia', 'Asia', 'Petronas Towers and street markets.', 3, 85, '1596422840844-f9f9f9f9f9f9', 3.139, 101.6869],
];

const categories = ['sightseeing', 'food', 'adventure', 'culture', 'shopping'];

const activityTemplates = [
  ['Old Town Walking Tour', 'sightseeing', 25, 3],
  ['Sunset Viewpoint Hike', 'adventure', 35, 4],
  ['Street Food Crawl', 'food', 45, 3],
  ['Museum Pass Day', 'culture', 40, 5],
  ['Local Cooking Class', 'food', 65, 4],
  ['Kayak & Coastal Ride', 'adventure', 55, 3],
  ['Guided History Tour', 'culture', 30, 2],
  ['Night Market Visit', 'shopping', 20, 2],
];

async function seed() {
  await connectDB();
  await Stop.deleteMany({});
  await Trip.deleteMany({});
  await Budget.deleteMany({});
  await Activity.deleteMany({});
  await City.deleteMany({});
  await User.deleteMany({});

  const cities = [];
  for (const row of citySeeds) {
    const [name, country, region, description, costIndex, popularity, imgId, lat, lng] = row;
    const c = await City.create({
      name,
      country,
      region,
      description,
      costIndex,
      popularity,
      coverImage: unsplash(imgId),
      coordinates: { lat, lng },
      tags: ['travel', region.toLowerCase()],
    });
    cities.push(c);
  }

  let activityCount = 0;
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    const perCity = 4;
    for (let j = 0; j < perCity; j++) {
      const tpl = activityTemplates[(i + j) % activityTemplates.length];
      const cat = categories[(i + j) % categories.length];
      await Activity.create({
        cityId: city._id,
        name: `${tpl[0]} — ${city.name}`,
        description: `Curated experience in ${city.name} focusing on ${cat}.`,
        category: cat,
        estimatedCost: tpl[2] + (j % 3) * 5,
        duration: tpl[3],
        image: city.coverImage,
        rating: 3.5 + (j % 3) * 0.5,
      });
      activityCount++;
    }
  }

  const admin = await User.create({
    name: 'Traveloop Admin',
    email: 'admin@traveloop.com',
    password: 'Admin@123',
    role: 'admin',
    city: 'Singapore',
    country: 'Singapore',
  });

  const demoUsers = [];
  for (let i = 1; i <= 5; i++) {
    demoUsers.push(
      await User.create({
        name: `Demo Traveler ${i}`,
        email: `demo${i}@traveloop.com`,
        password: 'Demo@123',
        phone: `+1000000000${i}`,
        city: cities[i * 5].name,
        country: cities[i * 5].country,
        savedDestinations: [cities[0]._id, cities[1]._id],
      })
    );
  }

  const trip1 = await Trip.create({
    userId: demoUsers[0]._id,
    title: 'Euro Highlights',
    description: 'Week across iconic European hubs.',
    startDate: new Date(Date.now() + 86400000 * 10),
    endDate: new Date(Date.now() + 86400000 * 24),
    coverPhoto: cities[0].coverImage,
    isPublic: true,
    totalBudget: 3200,
    publicSlug: 'demo-euro-' + Date.now().toString(36),
  });
  await Budget.create({
    tripId: trip1._id,
    transport: 600,
    accommodation: 1200,
    activities: 700,
    meals: 500,
    miscellaneous: 200,
    dailyLimit: 250,
  });

  const actsParis = await Activity.find({ cityId: cities[0]._id }).limit(3);
  const stop1 = await Stop.create({
    tripId: trip1._id,
    cityId: cities[0]._id,
    cityName: cities[0].name,
    country: cities[0].country,
    arrivalDate: trip1.startDate,
    departureDate: new Date(new Date(trip1.startDate).getTime() + 86400000 * 3),
    activities: actsParis.map((a) => a._id),
    order: 0,
    stopBudget: 900,
  });
  const actsBarca = await Activity.find({ cityId: cities[5]._id }).limit(2);
  const stop2 = await Stop.create({
    tripId: trip1._id,
    cityId: cities[5]._id,
    cityName: cities[5].name,
    country: cities[5].country,
    arrivalDate: new Date(new Date(trip1.startDate).getTime() + 86400000 * 4),
    departureDate: trip1.endDate,
    activities: actsBarca.map((a) => a._id),
    order: 1,
    stopBudget: 800,
  });
  trip1.stops = [stop1._id, stop2._id];
  await trip1.save();

  console.log(`Seeded ${cities.length} cities, ${activityCount} activities.`);
  console.log(`Admin: admin@traveloop.com / Admin@123`);
  console.log(`Demo: demo1@traveloop.com / Demo@123 (demo2...demo5)`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
