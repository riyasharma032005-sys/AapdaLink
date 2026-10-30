const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const EmergencyRequest = require('./models/EmergencyRequest');
const Resource = require('./models/Resource');
const Shelter = require('./models/Shelter');
const Notification = require('./models/Notification');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aapdalink');
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing collections
    await User.deleteMany();
    await EmergencyRequest.deleteMany();
    await Resource.deleteMany();
    await Shelter.deleteMany();
    await Notification.deleteMany();

    console.log('Cleared existing database records.');

    // 1. Create Users for all roles
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@aapdalink.org',
      password: 'password123',
      phone: '+91 9876543210',
      role: 'admin',
      isVerified: true,
      address: 'Central Emergency Command, Mumbai',
      location: { type: 'Point', coordinates: [72.8777, 19.0760] }
    });

    const citizen1 = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav@gmail.com',
      password: 'password123',
      phone: '+91 9820011223',
      role: 'citizen',
      isVerified: true,
      address: 'Bandra West, Mumbai',
      location: { type: 'Point', coordinates: [72.8347, 19.0596] }
    });

    const citizen2 = await User.create({
      name: 'Pooja Patel',
      email: 'pooja@gmail.com',
      password: 'password123',
      phone: '+91 9819922334',
      role: 'citizen',
      isVerified: true,
      address: 'Kurla East, Mumbai',
      location: { type: 'Point', coordinates: [72.8890, 19.0657] }
    });

    const volunteer1 = await User.create({
      name: 'Rohan Deshmukh',
      email: 'rohan@volunteer.org',
      password: 'password123',
      phone: '+91 9765432109',
      role: 'volunteer',
      skills: ['First Aid', 'Swimming & Rescue', 'Driving'],
      isVerified: true,
      isAvailable: true,
      address: 'Dadar, Mumbai',
      location: { type: 'Point', coordinates: [72.8427, 19.0178] }
    });

    const ngo1 = await User.create({
      name: 'Seva Relief Foundation',
      email: 'contact@sevarelief.org',
      password: 'password123',
      phone: '+91 9988776655',
      role: 'ngo',
      organizationName: 'Seva Relief NGO',
      isVerified: true,
      address: 'Andheri East, Mumbai',
      location: { type: 'Point', coordinates: [72.8697, 19.1136] }
    });

    console.log('Created Users: Admin, Citizens, Volunteer, NGO');

    // 2. Create Emergency Requests
    const req1 = await EmergencyRequest.create({
      citizen: citizen1._id,
      title: 'Waterlogging & Elderly Medical Help Needed',
      emergencyType: 'Medicine',
      description: 'Severe waterlogging inside our ground floor home. Diabetic patient running out of insulin supply and fresh drinking water.',
      numberOfPeopleAffected: 3,
      priority: 'High',
      status: 'Pending',
      address: 'Flat 102, Near Bandra Station West',
      contactPhone: '+91 9820011223',
      location: { type: 'Point', coordinates: [72.8360, 19.0544] },
      statusHistory: [
        {
          status: 'Pending',
          updatedBy: citizen1._id,
          comment: 'Initial distress request created.'
        }
      ]
    });

    const req2 = await EmergencyRequest.create({
      citizen: citizen2._id,
      title: 'Flash Flood Rescue & Boat Required',
      emergencyType: 'Rescue',
      description: 'Water level reached 4 feet. Family stranded on terrace with 2 children. Need inflatable rescue boat evacuation.',
      numberOfPeopleAffected: 4,
      priority: 'Critical',
      status: 'In Progress',
      address: 'Near Mithi River Bank, Kurla East',
      contactPhone: '+91 9819922334',
      assignedTo: volunteer1._id,
      assignedRole: 'volunteer',
      location: { type: 'Point', coordinates: [72.8872, 19.0680] },
      statusHistory: [
        {
          status: 'Pending',
          updatedBy: citizen2._id,
          comment: 'SOS distress signal.'
        },
        {
          status: 'In Progress',
          updatedBy: volunteer1._id,
          comment: 'Volunteer Rohan accepted and is en route with inflatable raft.'
        }
      ]
    });

    const req3 = await EmergencyRequest.create({
      citizen: citizen1._id,
      title: 'Dry Ration Food Packs Required for Community',
      emergencyType: 'Food',
      description: 'Around 25 migrant families sheltered in community hall requiring cooked meals or dry ration packs.',
      numberOfPeopleAffected: 25,
      priority: 'High',
      status: 'Pending',
      address: 'Community Center, Santacruz East',
      contactPhone: '+91 9820011223',
      location: { type: 'Point', coordinates: [72.8550, 19.0800] },
      statusHistory: [
        {
          status: 'Pending',
          updatedBy: citizen1._id,
          comment: 'Community food support requested.'
        }
      ]
    });

    console.log('Created Emergency Requests.');

    // 3. Create Shelters
    await Shelter.create([
      {
        ngo: ngo1._id,
        name: 'Andheri Municipal Relief Camp',
        address: 'Bhavans College Ground, Andheri West, Mumbai',
        location: { type: 'Point', coordinates: [72.8270, 19.1238] },
        capacity: 250,
        currentOccupancy: 85,
        contactPerson: 'Suresh Patil',
        contactPhone: '+91 9870022114',
        amenities: ['Drinking Water', 'Medical Camp', 'Food Service', 'Power Generator', 'Dry Bedding'],
        status: 'Open'
      },
      {
        ngo: ngo1._id,
        name: 'Dadar Community Disaster Shelter',
        address: 'Shivaji Park Gymkhana Hall, Dadar West',
        location: { type: 'Point', coordinates: [72.8390, 19.0260] },
        capacity: 150,
        currentOccupancy: 140,
        contactPerson: 'Kavita Nair',
        contactPhone: '+91 9821144332',
        amenities: ['Drinking Water', 'Hot Meals', 'First Aid Station'],
        status: 'Near Full'
      }
    ]);

    console.log('Created Shelters.');

    // 4. Create Resources
    await Resource.create([
      {
        ngo: ngo1._id,
        category: 'Food',
        itemName: 'Ready-to-eat Ration Packs',
        quantity: 500,
        unit: 'packets',
        warehouseLocation: 'Seva Warehouse A, Andheri East',
        notes: 'Each packet contains biscuits, glucose, and self-heating meal',
        status: 'Available'
      },
      {
        ngo: ngo1._id,
        category: 'Water',
        itemName: '1 Litre Mineral Water Bottles',
        quantity: 1200,
        unit: 'litres',
        warehouseLocation: 'Seva Warehouse A, Andheri East',
        notes: 'Packaged clean drinking water',
        status: 'Available'
      },
      {
        ngo: ngo1._id,
        category: 'First Aid',
        itemName: 'Disaster First Aid & Bandage Kits',
        quantity: 45,
        unit: 'kits',
        warehouseLocation: 'Dadar Health Center Depot',
        notes: 'Includes antiseptic, bandages, gauze, scissors and painkillers',
        status: 'Available'
      },
      {
        ngo: ngo1._id,
        category: 'Blankets',
        itemName: 'Thermal Wool Blankets',
        quantity: 200,
        unit: 'pieces',
        warehouseLocation: 'Seva Warehouse B, Kurla',
        notes: 'Waterproof protective packaging',
        status: 'Available'
      }
    ]);

    console.log('Created NGO Resources.');

    // 5. Create Sample Notifications
    await Notification.create([
      {
        recipient: citizen2._id,
        sender: volunteer1._id,
        title: 'Help is on the way!',
        message: 'Volunteer Rohan Deshmukh has accepted your rescue request.',
        type: 'assignment',
        relatedRequest: req2._id,
        isRead: false
      },
      {
        recipient: citizen1._id,
        sender: admin._id,
        title: 'High Alert Advisory',
        message: 'Heavy rainfall warning active for Mumbai coastal belt for the next 24 hours.',
        type: 'broadcast',
        isRead: true
      }
    ]);

    console.log('Created Notifications.');

    console.log('\n--- SEEDING COMPLETED SUCCESSFULLY ---');
    console.log('Default Test Logins:');
    console.log('1. Admin:     admin@aapdalink.org / password123');
    console.log('2. Citizen:   aarav@gmail.com / password123');
    console.log('3. Volunteer: rohan@volunteer.org / password123');
    console.log('4. NGO:       contact@sevarelief.org / password123');
    console.log('--------------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
