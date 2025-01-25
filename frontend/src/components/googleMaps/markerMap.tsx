import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import loader from "./googleMapsLoader";
import {
  storeShelterLocations,
  getShelterLocations,
} from "../../helpers/shelter";
import { useAuthStore } from "../../store/authStore";
const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

interface Location {
  name: string;
  lat: number;
  lng: number;
}

declare global {
  interface Window {
    google: typeof google;
  }
}

const mapContainerStyle: React.CSSProperties = {
  width: "70vw",
  height: "70vh",
  margin: "50px auto",
};

const center = {
  lat: -34.397,
  lng: 150.644,
};

const customIcon = "./house.png"

const MapWithClickableCustomMarkers: React.FC = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [locationArray, setLocationArray] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLng | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [nearestCalc, setNearestCalc] = useState(false);

  const { user } = useAuthStore();
  const role = user?.role;

  const handleLocationError = (
    browserHasGeolocation: boolean,
    infoWindow: google.maps.InfoWindow,
    pos: google.maps.LatLng,
    map: google.maps.Map
  ) => {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  };

  const handleSave = async () => {
    try {
      const response = await storeShelterLocations(locationArray);
      toast.success(response.message);
    } catch (error) {
      toast.error("Error saving shelter locations");
      console.error(error);
    }
  };

  const getPlaceName = (
    lat: number,
    lng: number,
    callback: (name: string) => void
  ) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };
    geocoder.geocode({ location: latlng }, (results: google.maps.GeocoderResult[] | null, status: string) => {
      if (status === "OK" && results && results[0]) {
        callback(results[0].formatted_address);
      } else {
        callback("Unknown Location");
      }
    });
  };

  const initializeMap = async () => {
    try {
      await loader.load();

      const map = new window.google.maps.Map(document.getElementById("map") as HTMLElement, {
        center,
        zoom: 8,
        mapId: "DEMO_MAP_ID",
      });

      const directionsRendererInstance = new window.google.maps.DirectionsRenderer();
      directionsRendererInstance.setMap(map);
      setDirectionsRenderer(directionsRendererInstance);

      if (role === "authority") {
        map.addListener("click", (event: google.maps.MapMouseEvent) => {
          const clickedLocation = event.latLng;
          if (!clickedLocation) return;

          getPlaceName(clickedLocation.lat(), clickedLocation.lng(), (name) => {
            new window.google.maps.Marker({
              position: clickedLocation,
              map,
              icon: customIcon,
              title: name,
            });

            const newLocation: Location = {
              name,
              lat: clickedLocation.lat(),
              lng: clickedLocation.lng(),
            };
            setLocationArray((prevArray) => [...prevArray, newLocation]);
            toast.success("Successfully placed marker");
          });
        });
      }

      const infoWindow = new window.google.maps.InfoWindow();
      const locationButton = document.createElement("button");
      locationButton.textContent = "Pan to Current Location";
      locationButton.classList.add("custom-map-control-button");
      map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(locationButton);

      locationButton.addEventListener("click", () => getCurrentLocation(map, infoWindow));

      getCurrentLocation(map, infoWindow);
      mapRef.current = map;
    } catch (error) {
      console.error("Error loading Google Maps API:", error);
    }
  };

  const getCurrentLocation = (map: google.maps.Map, infoWindow: google.maps.InfoWindow) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          setCurrentLocation(pos);
          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => handleLocationError(true, infoWindow, map.getCenter()!, map),
        { enableHighAccuracy: true }
      );
    } else {
      handleLocationError(false, infoWindow, map.getCenter()!, map);
    }
  };

  const handleGet = async () => {
    try {
      const response = await getShelterLocations();
      const newShelters = response.shelters.map((shelter: Location) => ({
        name: shelter.name,
        lat: parseFloat(shelter.lat.toString()),
        lng: parseFloat(shelter.lng.toString()),
      }));

      setLocationArray((prev) => [...prev, ...newShelters]);

      if (mapRef.current) {
        newShelters.forEach((place: Location) => {
          new window.google.maps.Marker({
            position: { lat: place.lat, lng: place.lng },
            map: mapRef.current!,
            icon: customIcon,
            title: place.name,
          });
        });
      }
    } catch (error) {
      toast.error("Error fetching shelter locations");
      console.error(error);
    }
  };

  const findNearestLocation = () => {
    if (!currentLocation || locationArray.length === 0) {
      toast.error("Current location or locations array is not available");
      return;
    }

    const distanceService = new window.google.maps.DistanceMatrixService();
    distanceService.getDistanceMatrix(
      {
        origins: [currentLocation],
        destinations: locationArray.map((location) => ({
          lat: location.lat,
          lng: location.lng,
        })),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response: google.maps.DistanceMatrixResponse | null, status: string) => {
        if (status !== "OK") {
          toast.error("Error calculating distances");
          return;
        }

        const distances = response?.rows[0]?.elements || [];
        let minDistance = Infinity;
        let nearestLocationIndex = -1;

        distances.forEach((element, index) => {
          if (element.status === "OK" && element.distance?.value < minDistance) {
            minDistance = element.distance.value;
            nearestLocationIndex = index;
          }
        });

        if (nearestLocationIndex !== -1) {
          calculateAndDisplayRoute(locationArray[nearestLocationIndex]);
        } else {
          toast.error("No nearest location found");
        }
      }
    );
  };

  const calculateAndDisplayRoute = (destination: Location) => {
    const directionsService = new window.google.maps.DirectionsService();

    if (directionsRenderer) {
      directionsRenderer.set("directions", null); // Clear previous route
    }

    directionsService.route(
      {
        origin: currentLocation!,
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response: google.maps.DirectionsResult    | null, status: string) => {
        if (status === "OK") {
          const leg = response?.routes[0]?.legs[0];
          setDistance(leg?.distance?.text || null);
          setDuration(leg?.duration?.text || null);
          setNearestCalc(true);
          directionsRenderer?.setDirections(response);
        } else {
          toast.error(`Directions request failed: ${status}`);
        }
      }
    );
  };

  const getDisasterPredictions = async () => {
    try {
      const response = await fetch(
        "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2023-07-01&endtime=2023-07-11"
      );
      const data = await response.json();
      console.log("Earthquake Data:", data);
    } catch (error) {
      toast.error("Error fetching disaster predictions");
      console.error(error);
    }
  };

  useEffect(() => {
    initializeMap();
  }, []);

  return (
      <div>
        
        { nearestCalc?( <>
          <div id="map" style={mapContainerStyle}></div>
          <h3> Distance: {distance}     Duration: {duration} </h3>
          <button type="button" onClick={findNearestLocation}>
            Get Nearest Route
          </button>
          <button type="button" onClick={handleGet}>
            Get all locations
          </button>
          {role === 'authority' && (  <> <button type="button" onClick={handleSave}>
            Save all shelters
          </button>  </>)}
          <button type="button" onClick={getDisasterPredictions}>
            Get earthquake predictions
          </button>
          </>
        ) : 
        (
          <>
          <div id="map" style={mapContainerStyle}></div>
          <button type="button" onClick={findNearestLocation}>
            Get Nearest Route
          </button>
          <button type="button" onClick={handleGet}>
            Get all locations
          </button>
          {role === 'authority' && (  <> <button type="button" onClick={handleSave}>
            Save all shelters
          </button>  </>)}
          <button type="button" onClick={getDisasterPredictions}>
            Get earthquake predictions
          </button>
       
          </>
        )}

      </div>
    );
  };


export default MapWithClickableCustomMarkers;
