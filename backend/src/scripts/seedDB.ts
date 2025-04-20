import { connectToDatabase, disconnectFromDatabase } from "../db/connection.js";
import { DisasterList } from "../models/disasterModel.js";
import axios from "axios";
import nlp from "compromise";

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

// Cache to avoid duplicate geocoding calls
const geocodeCache = new Map<string, Location>();

// Extracts place names using NLP
function extractLocationsFromText(text: string): string[] {
  const doc = nlp(text);
  const places = doc.places().out('array');
  return [...new Set(places as string[])];
}

// Uses OpenCage to geocode place names
async function geocodePlace(place: string): Promise<Location | null> {
  if (geocodeCache.has(place)) return geocodeCache.get(place);

  try {
    const response = await axios.get(process.env.OPENCAGE_API_URL, {
      params: {
        q: `${place}, Bangladesh`,
        key: process.env.OPENCAGE_API_KEY,
        limit: 1,
        countrycode: "bd"
      }
    });

    const geometry = response.data.results[0]?.geometry;
    if (geometry) {
      const location = { lat: geometry.lat, lng: geometry.lng };
      geocodeCache.set(place, location);
      return location;
    }
  } catch (err) {
    console.error(`Geocode failed for ${place}:`, err.message);
  }

  return null;
}

async function fetchReliefWebData(): Promise<Disaster[]> {
  try {
    const reports = await fetchReports();
    const disasters: Disaster[] = [];

    for (const report of reports) {
      const disasterData = await processReport(report);
      if (disasterData) disasters.push(...disasterData);
    }

    return disasters;
  } catch (error) {
    console.error("Error fetching data from ReliefWeb:", error.message);
    return [];
  }
}

async function fetchReports(): Promise<any[]> {
  const response = await axios.get(process.env.RELIEF_WEB_API_URL, {
    params: {
      appname: "apidoc",
      "query[value]": "Bangladesh",
      "filter[field]": "primary_country.name",
      "filter[value]": "Bangladesh",
      limit: 100
    }
  });
  return response.data.data;
}

async function processReport(report: any): Promise<Disaster[] | null> {
  try {
    const detailResponse = await axios.get(
      `${process.env.RELIEF_WEB_API_URL}/${report.id}`,
      { params: { appname: "apidoc" } }
    );

    const reportData = detailResponse.data.data[0]?.fields;
    if (!reportData?.disaster_type?.length || reportData.primary_country?.name !== "Bangladesh") {
      return null;
    }

    const description = reportData.body ?? "";
    const location = await determineLocation(description, reportData);

    if (!location) return null;

    return reportData.disaster_type.map((disasterType: any) => ({
      type: disasterType.name,
      location,
      date: reportData.date ? new Date(reportData.date.created) : undefined,
      title: reportData.title ?? "No title provided",
      description: description.substring(0, 500) ?? "No description provided"
    }));
  } catch (error) {
    console.error(`Error processing report ${report.id}:`, error.message);
    return null;
  }
}

async function determineLocation(description: string, reportData: any): Promise<Location | null> {
  const placeNames = extractLocationsFromText(description);

  for (const place of placeNames) {
    if (place !== "Bangladesh") {
      const location = await geocodePlace(place);
      if (location) return location;
    }
  }

  if (reportData.primary_country?.location) {
    return {
      lat: reportData.primary_country.location.lat,
      lng: reportData.primary_country.location.lon
    };
  }

  return null;
}

async function seedDB() {
  try {
    console.log("Seeding Database with ReliefWeb data...");
    await connectToDatabase();
    await DisasterList.deleteMany({});
    console.log("Old Data Deleted!");

    const disasters = await fetchReliefWebData();

    if (disasters.length === 0) {
      console.log("No valid disaster data found. Using fallback...");
      const fallback = [
        { type: "Flood", location: { lat: 23.81, lng: 90.41 }, frequency: 5 },
        { type: "Cyclone", location: { lat: 22.35, lng: 91.78 }, frequency: 3 }
      ];
      for (const d of fallback) await DisasterList.create(d);
    } else {
      console.log(`Inserting ${disasters.length} disasters into database...`);
      for (const d of disasters) {
        await DisasterList.create(d);
      }
    }

    console.log("Seeding Successful!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await disconnectFromDatabase();
    console.log("Disconnected from MongoDB.");
  }
}

seedDB();
