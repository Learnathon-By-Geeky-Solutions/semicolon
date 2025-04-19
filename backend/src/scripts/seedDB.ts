import { connectToDatabase, disconnectFromDatabase } from "../db/connection.js";
import { DisasterList } from "../models/disasterModel.js";
import axios from "axios";

interface Location {
  lat: number;
  lng: number;
}

interface Disaster {
  type: string;
  location: Location;
  frequency?: number;
  date?: Date;
  title?: string;
  affectedPeople?: number;
  description?: string;
}

async function fetchReliefWebData(): Promise<Disaster[]> {
  try {
    // Fetch the list of reports for Bangladesh
    const listResponse = await axios.get(
      "https://api.reliefweb.int/v1/reports",
      {
        params: {
          appname: "apidoc",
          "query[value]": "Bangladesh",
          limit: 100 
        }
      }
    );

    const reports = listResponse.data.data;
    const disasters: Disaster[] = [];

    // Process each report
    for (const report of reports) {
      try {
        // Fetch detailed report data
        const detailResponse = await axios.get(
          `https://api.reliefweb.int/v1/reports/${report.id}`,
          { params: { appname: "apidoc" } }
        );

        const reportData = detailResponse.data.data[0].fields;
        
        // Extract disaster types if available
        if (reportData.disaster_type && reportData.disaster_type.length > 0) {
          // Get primary country location
          let location: Location | null = null;
          if (reportData.primary_country && reportData.primary_country.location) {
            location = {
              lat: reportData.primary_country.location.lat,
              lng: reportData.primary_country.location.lon
            };
          }

          // If we have a valid location, create disaster entries for each disaster type
          if (location) {
            for (const disasterType of reportData.disaster_type) {
              const disaster: Disaster = {
                type: disasterType.name,
                location,
                date: reportData.date ? new Date(reportData.date.created) : undefined,
                title: reportData.title,
                description: reportData.body?.substring(0, 500) // Truncate to avoid overly long descriptions
              };
              
              // Try to extract affected people count from body text if available
              /*if (reportData.body && reportData.body.includes("million people") || reportData.body.includes("people have been")) {
                const bodyText = reportData.body;
                const matches = bodyText.match(/(\d+(\.\d+)?\s*million people)|(\d+,\d+\s*people)|(\d+\s*people)/i);
                if (matches) {
                  let count = matches[0];
                  if (count.includes("million")) {
                    const num = parseFloat(count.split(" ")[0]);
                    disaster.affectedPeople = Math.round(num * 1000000);
                  } else {
                    count = count.replace(/,/g, "").replace(/people/i, "").trim();
                    disaster.affectedPeople = parseInt(count);
                  }
                }
              }*/
              
              disasters.push(disaster);
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching details for report ${report.id}:`, error.message);
        // Continue with the next report
      }
    }

    return disasters;
  } catch (error) {
    console.error("Error fetching data from ReliefWeb API:", error.message);
    return [];
  }
}

async function seedDB() {
  try {
    console.log("Seeding Database with ReliefWeb data...");
    await connectToDatabase(); // Ensure MongoDB is connected

    await DisasterList.deleteMany({}); // Clear existing data
    console.log("Old Data Deleted!");

    // Fetch disaster data from ReliefWeb API
    const disasters = await fetchReliefWebData();
    
    if (disasters.length === 0) {
      console.log("No disaster data retrieved. Falling back to default data.");
      // Fallback to default data if no data from API
      const defaultDisasters = [
        { type: "Flood", location: { lat: 23.81, lng: 90.41 }, frequency: 5 },
        { type: "Cyclone", location: { lat: 22.35, lng: 91.78 }, frequency: 3 }
      ];
      
      for (const disaster of defaultDisasters) {
        await DisasterList.create(disaster);
      }
    } else {
      console.log(`Retrieved ${disasters.length} disasters from ReliefWeb API`);
      
      // Create frequency map to calculate frequency of each disaster type
      /*const typeFrequency = disasters.reduce((acc, disaster) => {
        acc[disaster.type] = (acc[disaster.type] || 0) + 1;
        return acc;
      }, {});
      
      // Add frequency to each disaster based on the map
      disasters.forEach(disaster => {
        disaster.frequency = typeFrequency[disaster.type];
      });*/
      
      // Save all disasters to database
      for (const disaster of disasters) {
        await DisasterList.create(disaster);
      }
    }

    console.log("Seeding Successful!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await disconnectFromDatabase(); // Close connection
    console.log("Disconnected from MongoDB.");
  }
}

seedDB();