import { connectToDatabase, disconnectFromDatabase } from "../db/connection.js";
import { DisasterList } from "../models/disasterModel.js";

async function seedDB() {
  try {
    console.log("Seeding Database...");
    await connectToDatabase(); // Ensure MongoDB is connected

    await DisasterList.deleteMany({}); // Clear existing data
    console.log("Old Data Deleted!");

    await DisasterList.create({
      disasters: [
        { type: "Flood", location: { lat: 23.81, lng: 90.41 }, frequency: 5 },
        { type: "Cyclone", location: { lat: 22.35, lng: 91.78 }, frequency: 3 }
      ]
    });

    console.log("Seeding Successful!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await disconnectFromDatabase(); // Close connection
    console.log("Disconnected from MongoDB.");
  }
}

seedDB();
