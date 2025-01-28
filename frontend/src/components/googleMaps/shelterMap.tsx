import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { GOOGLE_MAPS_API_KEY } from "../../constants/paths";
import { Loader } from "@googlemaps/js-api-loader";
import { ResourcePopup } from "./resourcePopup";

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ["places", "marker"],
});

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface Resource {
  food: number;
  water: number;
  medicine: number;
}

const center = {
  lat: -34.397,
  lng: 150.644,
};

const MapWithShelters: React.FC = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [shelters, setShelters] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLng | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [resources, setResources] = useState<Resource>({ food: 0, water: 0, medicine: 0 });
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({ food: false, water: false, medicine: false });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState<Location | null>(null);
  const houseIcon = "./house.png";

  const handleEdit = (field: string) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = (field: string, value: number) => {
    setResources((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = () => {
    if (selectedShelter) {
      setShelters((prev) => prev.filter((shelter) => shelter !== selectedShelter));
      setSelectedShelter(null);
      setIsPopupOpen(false);
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

        const newShelter: Location = {
          name: `Shelter ${shelters.length + 1}`,
          lat: clickedLocation.lat(),
          lng: clickedLocation.lng(),
        };

        const houseImage = document.createElement('img');
        houseImage.src = houseIcon;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: clickedLocation,
          map,
          title: newShelter.name,
          content: houseImage,
        });

        marker.addListener('click', () => {
         
            setSelectedShelter(newShelter);
            setIsPopupOpen(true);
            // Fetch or initialize resources for the selected shelter
            setResources({ food: 100, water: 50, medicine: 20 }); 
          
        });


        setShelters((prev) => [...prev, newShelter]);
        toast.success("Shelter marker placed!");
      });

      const directionsRendererInstance = new google.maps.DirectionsRenderer();
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

    directionsService.route(
      {
        origin: currentLocation!,
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode,
      },
      (response, status) => {
        if (status === "OK" && directionsRenderer) {
          directionsRenderer.setDirections(response);
        } else {
          toast.error("Directions request failed.");
        }
      }
    );
  };

  useEffect(() => {
    initializeMap();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Main Content */}
      <div id="map" className="w-full h-[70vh] rounded-lg shadow-lg mb-6"></div>
      <div className="text-center space-x-4">
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