import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { GOOGLE_MAPS_API_KEY } from "../../constants/paths";
import { Loader } from "@googlemaps/js-api-loader";
import { ResourcePopup } from "./resourcePopup";
import { Location, Shelter, NewShelter } from "../../types/shelterMapTypes";
import { getShelters, saveShelters } from "../../helpers/shelter";

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ["places", "marker"],
});


const center = {
  lat: -34.397,
  lng: 150.644,
};

interface MapWithSheltersProps {
  permission: 'view' | 'edit';
}

const MapWithShelters: React.FC<MapWithSheltersProps> = ({ permission }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLng | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({ food: false, water: false, medicine: false });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  

  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const [isRouteDisplayed, setIsRouteDisplayed] = useState(false);
  const shelterCountRef = useRef(0);

  const savedShelterIcon = "./saved_shelter_flag.png";
  const newlyPlacedShelterIcon = "./new_shelter_flag.png";

  const initializeShelterCount = () => {
    shelterCountRef.current = shelters.length;
  };

  useEffect(() => {
    if (shelters.length > 0) {
      initializeShelterCount();
    }
  }, [shelters]);

  const handleEdit = (field: string) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleResourceChange = (field: string, value: number | string) => {
    if (selectedShelter) {
      setShelters(prevShelters => prevShelters.map(shelter =>
        shelter._id === selectedShelter._id
          ? { ...shelter, [field]: value }
          : shelter
      ));
      setSelectedShelter(prev => prev ? { ...prev, [field]: value } : prev);
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

      // Only add click listener for shelter placement if user has edit permission
      if (permission === 'edit') {
        map.addListener("click", (event: google.maps.MapMouseEvent) => {
          const clickedLocation = event.latLng;
          if (!clickedLocation) return;

          shelterCountRef.current += 1;

          const newShelter: NewShelter & { _id: string } = {
            _id: `temp-${Date.now()}`,
            name: `Shelter ${shelterCountRef.current}`,
            lat: clickedLocation.lat(),
            lng: clickedLocation.lng(),
            district_id: "1",
            district_name: "tangail",
            food: 0,
            water: 0,
            medicine: 0,
          };

          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: clickedLocation,
            map,
            title: newShelter.name,
            content: createMarkerImage(newlyPlacedShelterIcon),
          });

          markersRef.current.set(newShelter._id, marker);

          marker.addListener('click', () => {
            setSelectedShelter(newShelter);
            setIsPopupOpen(true);
          });

          setShelters((prev) => [...prev, newShelter]);
          toast.success("Shelter marker placed!");
        });
      }

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
    if (mapRef.current && shelters.length >= 0) {
      markersRef.current.forEach(marker => marker.map = null);
      markersRef.current.clear();

      shelters.forEach(shelter => {
        const iconPath = shelter._id.startsWith('temp-') ? newlyPlacedShelterIcon : savedShelterIcon;
        
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: shelter.lat, lng: shelter.lng },
          map: mapRef.current,
          title: shelter.name,
          content: createMarkerImage(iconPath),
        });

        marker.addListener('click', () => {
          setSelectedShelter(shelter);
          setIsPopupOpen(true);
        });

        markersRef.current.set(shelter._id, marker);
      });
    }
  }, [shelters, newlyPlacedShelterIcon, savedShelterIcon]);

  const handleSaveShelters = async () => {
    const sheltersToSave = shelters.map(shelter => {      
      const { _id, ...restOfShelter } = shelter;
      if (_id.startsWith('temp-')) {
        return {
          ...restOfShelter,
          food: shelter.food,
          water: shelter.water,
          medicine: shelter.medicine
        };
      }
      return {
        _id,
        ...restOfShelter,
        food: shelter.food,
        water: shelter.water,
        medicine: shelter.medicine
      };
    });
    
    try {
      await saveShelters(sheltersToSave as Shelter[]);
      const savedShelters = await getShelters();
      setShelters(savedShelters);
      toast.success("Shelters saved successfully");
    } catch (error) {
      toast.error("Failed to save shelters");
      console.error("Error saving shelters:", error);
    }
  };

  const handleSaveResources = async () => {
    if (selectedShelter) {
      try {
        const sheltersToSave = shelters.map(({ _id, ...shelter }) => {
          if (_id.startsWith('temp-')) {
            return shelter;
          }
          return { _id, ...shelter };
        });

        await saveShelters(sheltersToSave as Shelter[]);
        toast.success("Resources updated successfully");

        setIsEditing(Object.keys(isEditing).reduce((acc, key) => ({
          ...acc,
          [key]: false
        }), {}));
      } catch (error) {
        toast.error("Failed to update resources");
        console.error("Error updating resources:", error);
      }
    }
    const savedShelters = await getShelters();
    setShelters(savedShelters)
  };

  const createMarkerImage = (iconPath: string) => {
    const img = document.createElement('img');
    img.src = iconPath;
    img.style.width = '32px';  
    img.style.height = '32px';
    return img;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Main Content */}
      <div id="map" className="w-full h-[70vh] rounded-lg shadow-lg mb-6"></div>
      <div className="text-center space-x-4">
        {permission === 'edit' && (
          <button
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none transition duration-300"
            onClick={handleSaveShelters}
          >
            Save Shelters
          </button>
        )}
        <button
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none transition duration-300"
          onClick={() => findNearestShelter(google.maps.TravelMode.DRIVING)}
        >
          Get Nearest Shelter (Driving)
        </button>
        <button
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none transition duration-300"
          onClick={() => findNearestShelter(google.maps.TravelMode.WALKING)}
        >
          Get Nearest Shelter (Walking)
        </button>
        {isRouteDisplayed && (
          <button
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none transition duration-300"
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
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSaveResources}
          onClose={() => setIsPopupOpen(false)}
          onDelete={handleDelete}
          onResourceChange={handleResourceChange}
          permission={permission}
        />
      )}
    </div>
  );
};

export default MapWithShelters;