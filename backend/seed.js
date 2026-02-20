import mongoose from "mongoose";
import dotenv from "dotenv";
import Buddy from "./models/Buddy.js";
import Visit from "./models/Visit.js";
import User from "./models/User.js";
import Review from "./models/Review.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const sampleBuddies = [
  {
    name: "Rohan Sharma",
    email: "rohan.sharma@example.com",
    phone: "+91 9876543210",
    rating: 4.8,
    location: "Manali",
    bio: "Friendly trek leader and local guide with 5 years of experience",
    specialties: ["Trekking", "Photography", "Local Cuisine"],
    languages: ["Hindi", "English", "Punjabi"],
    hourlyRate: 500,
    availability: true,
    verified: true,
    experience: 5,
    profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop"
  },
  {
    name: "Ananya Verma",
    email: "ananya.verma@example.com",
    phone: "+91 9123456789",
    rating: 4.7,
    location: "Goa",
    bio: "Beach photographer & foodie guide who loves showing tourists the best of Goan culture",
    specialties: ["Beach Activities", "Photography", "Food Tours"],
    languages: ["Hindi", "English", "Konkani"],
    hourlyRate: 600,
    availability: true,
    verified: true,
    experience: 3,
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop"
  },
  {
    name: "Karan Singh",
    email: "karan.singh@example.com",
    phone: "+91 9812345678",
    rating: 4.9,
    location: "Jaipur",
    bio: "History buff and local art lover specializing in heritage tours",
    specialties: ["Heritage Tours", "Art & Culture", "Historical Sites"],
    languages: ["Hindi", "English", "Rajasthani"],
    hourlyRate: 550,
    availability: true,
    verified: true,
    experience: 7,
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
  },
  {
    name: "Meera Joshi",
    email: "meera.joshi@example.com",
    phone: "+91 9000001234",
    rating: 4.6,
    location: "Rishikesh",
    bio: "Yoga instructor and river guide offering spiritual and adventure experiences",
    specialties: ["Yoga", "Meditation", "River Rafting"],
    languages: ["Hindi", "English"],
    hourlyRate: 450,
    availability: true,
    verified: true,
    experience: 4,
    profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&fit=crop"
  },
  {
    name: "Aditya Rao",
    email: "aditya.rao@example.com",
    phone: "+91 9823123456",
    rating: 4.8,
    location: "Leh",
    bio: "Adventure biker and camping expert for high-altitude expeditions",
    specialties: ["Biking", "Camping", "Mountain Trekking"],
    languages: ["Hindi", "English", "Ladakhi"],
    hourlyRate: 700,
    availability: true,
    verified: true,
    experience: 6,
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop"
  }
];

const sampleUsers = [
  {
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    password: "password123",
    phone: "+91 9876543211",
    bio: "Travel enthusiast exploring India",
    preferences: {
      favoriteCategories: ["mountains", "heritage"],
      budget: "medium",
      travelStyle: "adventure"
    },
    isVerified: true,
    role: "user"
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    password: "password123",
    phone: "+91 9876543212",
    bio: "Beach lover and food blogger",
    preferences: {
      favoriteCategories: ["beaches", "states"],
      budget: "high",
      travelStyle: "leisure"
    },
    isVerified: true,
    role: "user"
  }
];

const seedDatabase = async () => {
  try {
    console.log("🌱 Seeding database...");

    // Clear existing data
    await Buddy.deleteMany({});
    await User.deleteMany({});
    await Visit.deleteMany({});
    await Review.deleteMany({});
    
    console.log("✅ Cleared existing data");

    // Insert buddies
    const buddies = await Buddy.insertMany(sampleBuddies);
    console.log(`✅ Inserted ${buddies.length} buddies`);

    // Insert users
    const users = await User.insertMany(sampleUsers);
    console.log(`✅ Inserted ${users.length} users`);

    // Insert sample visits
    const sampleVisits = [
      {
        userId: users[0]._id,
        destination: "Manali",
        selectedDate: new Date("2025-12-15")
      },
      {
        userId: users[0]._id,
        destination: "Goa",
        selectedDate: new Date("2025-11-25")
      },
      {
        userId: users[1]._id,
        destination: "Jaipur",
        selectedDate: new Date("2025-12-01")
      }
    ];
    
    const visits = await Visit.insertMany(sampleVisits);
    console.log(`✅ Inserted ${visits.length} visits`);

    // Insert sample reviews
    const sampleReviews = [
      {
        userId: users[0]._id,
        destinationId: "states-0",
        destinationName: "Kerala",
        category: "states",
        rating: 5,
        title: "Amazing backwaters experience!",
        comment: "Kerala's backwaters are truly God's own country. Highly recommended!",
        verified: true
      },
      {
        userId: users[1]._id,
        destinationId: "beaches-0",
        destinationName: "Goa Beach",
        category: "beaches",
        rating: 4,
        title: "Beautiful beaches and great food",
        comment: "Loved the beaches and seafood. Perfect for a relaxing vacation.",
        verified: true
      }
    ];
    
    const reviews = await Review.insertMany(sampleReviews);
    console.log(`✅ Inserted ${reviews.length} reviews`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Buddies: ${buddies.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Visits: ${visits.length}`);
    console.log(`   - Reviews: ${reviews.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
