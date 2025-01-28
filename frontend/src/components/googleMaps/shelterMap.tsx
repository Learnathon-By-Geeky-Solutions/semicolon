import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { GOOGLE_MAPS_API_KEY } from "../../constants/paths";
import { Loader } from "@googlemaps/js-api-loader";
import { ResourcePopup } from "./resourcePopup";
import { Location, Resource, Shelter, NewShelter } from "../../types/shelterMapTypes";
import { getShelters, saveShelters } from "../../helpers/shelter";

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ["places", "marker"],
});


const center = {
  lat: -34.397,
  lng: 150.644,
};

const MapWithShelters: React.FC = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLng | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [resources, setResources] = useState<Resource>({ food: 0, water: 0, medicine: 0 });

  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({ food: false, water: false, medicine: false });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const houseIcon = "./house.png";

  // Add a ref to store markers
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());

  // Add state to track if route is displayed
  const [isRouteDisplayed, setIsRouteDisplayed] = useState(false);

  const handleEdit = (field: string) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = (field: string, value: number) => {
    if (selectedShelter) {
      setShelters(prevShelters => prevShelters.map(shelter => 
        shelter === selectedShelter 
          ? { ...shelter, [field]: value }
          : shelter
      ));
      setResources(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleDelete = async () => {
    if (selectedShelter) {
      const marker = markersRef.current.get(selectedShelter._id);
      if (marker) {
        marker.map = null; 
        markersRef.current.delete(selectedShelter._id);
      }

      setShelters((prev) => prev.filter((shelter) => shelter._id !== selectedShelter._id));
      
      await saveShelters(shelters.filter(shelter => shelter._id !== selectedShelter._id));
      
      setSelectedShelter(null);
      setIsPopupOpen(false);
      
      toast.success("Shelter deleted successfully");
    }
  };


  const initializeMap = async () => {
    try {
      await loader.load();
      const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center,
        zoom: 12,
        mapId: "shelter-map",
      });

      map.addListener("click", (event: google.maps.MapMouseEvent) => {
        const clickedLocation = event.latLng;
        if (!clickedLocation) return;

        const newShelter: NewShelter & { _id: string } = {
          _id: `temp-${Date.now()}`, // Temporary ID for new shelters
          name: `Shelter ${shelters.length + 1}`,
          lat: clickedLocation.lat(),
          lng: clickedLocation.lng(),
          district_id: "1",
          district_name: "tangail",
          food: 0,
          water: 0,
          medicine: 0,
        };

        const houseImage = document.createElement('img');
        houseImage.src = houseIcon;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: clickedLocation,
          map,
          title: newShelter.name,
          content: houseImage,
        });

        markersRef.current.set(newShelter._id, marker);

        marker.addListener('click', () => {
          setSelectedShelter(newShelter);
          setIsPopupOpen(true);
          setResources({ 
            food: newShelter.food, 
            water: newShelter.water, 
            medicine: newShelter.medicine 
          });
        });

        setShelters((prev) => [...prev, newShelter]);
        toast.success("Shelter marker placed!");
      });

      // Create new directions renderer
      const directionsRendererInstance = new google.maps.DirectionsRenderer({
        suppressMarkers: true
      });
      directionsRendererInstance.setMap(map);
      setDirectionsRenderer(directionsRendererInstance);

      getCurrentLocation(map);
      mapRef.current = map;
    } catch (error) {
      console.error("Error loading Google Maps API:", error);
    }
  };

  const getCurrentLocation = (map: google.maps.Map) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          setCurrentLocation(pos);
          map.setCenter(pos);

          new google.maps.marker.AdvancedMarkerElement({
            position: pos,
            map,
            title: "Your Location",
          });
        },
        () => {
          toast.error("Error: The Geolocation service failed.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast.error("Error: Your browser doesn't support geolocation.");
    }
  };

  const findNearestShelter = (travelMode: google.maps.TravelMode) => {
    if (!currentLocation || shelters.length === 0) {
      toast.error("No current location or shelters available.");
      return;
    }

    const distanceService = new google.maps.DistanceMatrixService();
    distanceService.getDistanceMatrix(
      {
        origins: [currentLocation],
        destinations: shelters.map((shelter) => ({ lat: shelter.lat, lng: shelter.lng })),
        travelMode,
      },
      (response, status) => {
        if (status !== "OK") {
          toast.error("Error calculating distances.");
          return;
        }

        const distances = response?.rows[0]?.elements;
        let minDistance = Infinity;
        let nearestShelterIndex = -1;

        distances?.forEach((element, index) => {
          if (element?.status === "OK" && element?.distance?.value < minDistance) {
            minDistance = element?.distance?.value;
            nearestShelterIndex = index;
          }
        });

        if (nearestShelterIndex !== -1) {
          const nearestShelter = shelters[nearestShelterIndex];
          displayDirections(nearestShelter, travelMode);
        } else {
          toast.error("No nearest shelter found.");
        }
      }
    );
  };

  const displayDirections = (destination: Location, travelMode: google.maps.TravelMode) => {
    const directionsService = new google.maps.DirectionsService();

    // Create new DirectionsRenderer if none exists
    if (!directionsRenderer && mapRef.current) {
      const newDirectionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true
      });
      newDirectionsRenderer.setMap(mapRef.current);
      setDirectionsRenderer(newDirectionsRenderer);
    }

    directionsService.route(
      {
        origin: currentLocation!,
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode,
      },
      (response, status) => {
        if (status === "OK" && directionsRenderer) {
          directionsRenderer.setOptions({
            suppressMarkers: true
          });
          directionsRenderer.setDirections(response);
          setIsRouteDisplayed(true);
        } else {
          toast.error("Directions request failed.");
        }
      }
    );
  };

  
  const clearRoute = () => {
    initializeMap();
    getShelters().then((shelters) => setShelters(shelters));
    setIsRouteDisplayed(false);
  };

  useEffect(() => {
    initializeMap();
    getShelters().then((shelters) => setShelters(shelters));
  }, []);

  useEffect(() => {
    if (mapRef.current && shelters.length > 0) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.map = null);
      markersRef.current.clear();

      shelters.forEach(shelter => {
        const houseImage = document.createElement('img');
        houseImage.src = houseIcon;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: shelter.lat, lng: shelter.lng },
          map: mapRef.current,
          title: shelter.name,
          content: houseImage,
        });

        marker.addListener('click', () => {
          setSelectedShelter(shelter);
          setIsPopupOpen(true);
          setResources({ 
            food: shelter.food, 
            water: shelter.water, 
            medicine: shelter.medicine 
          });
        });

        markersRef.current.set(shelter._id, marker);
      });
    }
  }, [shelters, houseIcon]);

  const handleSaveShelters = async () => {
    const sheltersToSave = shelters.map(({ _id, ...shelter }) => {      
      if (_id.startsWith('temp-')) {
        return shelter;
      }
      return { _id, ...shelter };
    });
    await saveShelters(sheltersToSave as Shelter[]);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Main Content */}
      <div id="map" className="w-full h-[70vh] rounded-lg shadow-lg mb-6"></div>
      <div className="text-center space-x-4">
          <button
              className="px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-600 focus:outline-none transition duration-300"
              onClick={handleSaveShelters}
            >
              Save Shelters
          </button>
          <button
            className="px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-600 focus:outline-none transition duration-300"
            onClick={() => findNearestShelter(google.maps.TravelMode.DRIVING)}
          >
            Get Nearest Shelter (Driving)
          </button>
          <button
            className="px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-600 focus:outline-none transition duration-300"
            onClick={() => findNearestShelter(google.maps.TravelMode.WALKING)}
          >
            Get Nearest Shelter (Walking)
          </button>
          {isRouteDisplayed && (
            <button
              className="px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-600 focus:outline-none transition duration-300"
              onClick={clearRoute}
            >
              Clear Route
            </button>
          )}
      </div>
      
      
  
      {/* Resource Popup */}
      {isPopupOpen && selectedShelter && (
        <ResourcePopup
          shelter={selectedShelter}
          resources={resources}
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          onClose={() => setIsPopupOpen(false)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default MapWithShelters;