import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Destination from "./models/Destination.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const seedDestinations = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for seeding");

    // Read data.json from frontend
    const dataPath = path.join(__dirname, "../frontend/finalized ezyexplorer/data.json");
    const rawData = fs.readFileSync(dataPath);
    const data = JSON.parse(rawData);

    // Clear existing destinations
    await Destination.deleteMany({});
    console.log("🗑️  Cleared existing destinations");

    // Insert destinations from JSON
    if (data.explore && Array.isArray(data.explore)) {
      const destinations = data.explore.map(item => ({
        title: item.title,
        description: item.description,
        image: item.image,
        category: item.category,
        rating: item.rating || 4.5,
        eco: item.eco || false,
        popularityScore: Math.floor(Math.random() * 1000)
      }));

      await Destination.insertMany(destinations);
      console.log(`✅ Seeded ${destinations.length} destinations`);
    }

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding destinations:", error);
    process.exit(1);
  }
};

seedDestinations();
