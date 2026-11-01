const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Category = require('./models/Category');
const Pet = require('./models/Pet');
const Product = require('./models/Product');

async function seed() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/petlink';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB for seeding:', mongoUri);

  // 1. Seed Admin & Test User
  const existingAdmin = await User.findOne({ email: 'admin@petlink.pk' });
  if (!existingAdmin) {
    await User.create({
      name: 'System Admin',
      email: 'admin@petlink.pk',
      phone: '03001234567',
      address: 'Main Boulevard, Gulberg, Lahore',
      role: 'admin',
      password: 'admin123',
      username: 'admin',
      city: 'Lahore',
    });
    console.log('Created admin user: admin@petlink.pk / admin123');
  } else {
    console.log('Admin user already exists');
  }

  const existingUser = await User.findOne({ email: 'user@petlink.pk' });
  if (!existingUser) {
    await User.create({
      name: 'Ali Khan',
      email: 'user@petlink.pk',
      phone: '03211234567',
      address: 'DHA Phase 5, Lahore',
      role: 'user',
      password: 'password123',
      username: 'alikhan',
      city: 'Lahore',
    });
    console.log('Created sample user: user@petlink.pk / password123');
  } else {
    console.log('Sample user already exists');
  }

  // 2. Seed Categories
  const countCat = await Category.countDocuments();
  if (countCat === 0) {
    await Category.insertMany([
      { name: 'Dogs', slug: 'dogs', description: 'Canine pets and supplies' },
      { name: 'Cats', slug: 'cats', description: 'Feline companions and care' },
      { name: 'Birds', slug: 'birds', description: 'Parrots, canaries and aviary' },
      { name: 'Food', slug: 'food', description: 'Nutrition and dry kibble' },
      { name: 'Accessories', slug: 'accessories', description: 'Collars, leashes and toys' },
    ]);
    console.log('Categories seeded.');
  }

  // 3. Seed Pets
  const countPets = await Pet.countDocuments();
  if (countPets === 0) {
    const adminUser = await User.findOne({ email: 'admin@petlink.pk' });
    await Pet.insertMany([
      {
        name: 'Milo',
        category: 'dogs',
        breed: 'Golden Retriever',
        age: '1.5 Years',
        gender: 'Male',
        weight: '28 kg',
        price: 0,
        listingType: 'adoption',
        location: 'Gulberg, Lahore',
        contactNumber: '03001234567',
        description: 'Milo is a cheerful, fully vaccinated golden retriever who loves kids and outdoor play.',
        isVaccinated: true,
        isNeutered: true,
        owner: adminUser._id,
        ownerName: 'System Admin',
        images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'],
      },
      {
        name: 'Luna',
        category: 'cats',
        breed: 'Persian Doll Face',
        age: '8 Months',
        gender: 'Female',
        weight: '3.5 kg',
        price: 25000,
        listingType: 'sale',
        location: 'DHA, Lahore',
        contactNumber: '03211234567',
        description: 'Purebred Persian triple coat kitten with gentle demeanor and litter trained.',
        isVaccinated: true,
        isNeutered: false,
        owner: adminUser._id,
        ownerName: 'System Admin',
        images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'],
      },
      {
        name: 'Rio',
        category: 'birds',
        breed: 'Cockatiel',
        age: '6 Months',
        gender: 'Male',
        weight: '100 g',
        price: 4500,
        listingType: 'sale',
        location: 'Islamabad',
        contactNumber: '03335551234',
        description: 'Hand tamed yellow crested cockatiel whistling tunes.',
        isVaccinated: true,
        isNeutered: false,
        owner: adminUser._id,
        ownerName: 'System Admin',
        images: ['https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=600&q=80'],
      },
    ]);
    console.log('Sample pets seeded.');
  }

  // 4. Seed Products
  const countProd = await Product.countDocuments();
  if (countProd === 0) {
    await Product.insertMany([
      {
        name: 'Royal Canin Maxi Adult Dog Food (4kg)',
        category: 'Food',
        price: 8500,
        stock: 50,
        description: 'Complete feed for large breed dogs with high quality protein and digestive support.',
        images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80'],
      },
      {
        name: 'Reflective Padded Dog Harness & Leash',
        category: 'Accessories',
        price: 2200,
        stock: 35,
        description: 'Breathable mesh chest harness with high visibility night reflective strips.',
        images: ['https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80'],
      },
      {
        name: 'Bentonite Clumping Cat Litter Lavender (10L)',
        category: 'Accessories',
        price: 1800,
        stock: 60,
        description: 'Instant clumping dust-free scented cat litter with maximum odor absorption.',
        images: ['https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80'],
      },
    ]);
    console.log('Sample products seeded.');
  }

  console.log('Local MongoDB seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
