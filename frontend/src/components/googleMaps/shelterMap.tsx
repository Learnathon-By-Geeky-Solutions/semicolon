import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { GOOGLE_MAPS_API_KEY } from "../../constants/paths";
import { Loader } from "@googlemaps/js-api-loader";
import { ResourcePopup } from "./resourcePopup";
import { Location, Shelter, NewShelter, MapWithSheltersProps, TravelMode } from "../../types/shelterMapTypes";
import { getShelters, saveShelters } from "../../helpers/shelter";
import LoadingSpinner from "../loadingSpinner";
import { MdMyLocation, MdSave, MdDirectionsCar, MdDirectionsWalk, MdClose, MdRoute } from "react-icons/md";

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ["places", "marker"],
});


const center = {
  lat: -34.397,
  lng: 150.644,
};



const MapWithShelters: React.FC<MapWithSheltersProps> = ({ permission }) => {
  const location = useLocation();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLng | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({ food: false, water: false, medicine: false });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  

  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const [isRouteDisplayed, setIsRouteDisplayed] = useState(false);
  const shelterCountRef = useRef(0);

  const savedShelterIcon = "./saved_shelter_flag.png";
  const newlyPlacedShelterIcon = "./new_shelter_flag.png";

  const [isSelectingShelter, setIsSelectingShelter] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Shelter | null>(null);
  const [selectedTravelMode, setSelectedTravelMode] = useState<TravelMode>('DRIVING');

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
    const loadMapAndShelters = async () => {
      setIsLoading(true);
      await initializeMap();
      const fetchedShelters = await getShelters();
      setShelters(fetchedShelters);
      setIsLoading(false);
    };

    loadMapAndShelters();

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.map = null);
      markersRef.current.clear();
    };
  }, [location.key]); // Re-run when location changes

  // Update markers whenever shelters change
  useEffect(() => {
    if (mapRef.current && shelters.length >= 0) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.map = null);
      markersRef.current.clear();

      // Create new markers
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
  }, [shelters]);

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

  const refreshLocation = () => {
    if (mapRef.current) {
      getCurrentLocation(mapRef.current);
      toast.success("Refreshing your location...");
    }
  };

  const handleShowRoute = (shelter: Shelter) => {
    if (shelter && currentLocation) {
      const travelMode = google.maps.TravelMode[selectedTravelMode];
      displayDirections(shelter, travelMode);
      setIsSelectingShelter(false);
      setSelectedDestination(null);
      setIsRouteDisplayed(true);
    } else {
      toast.error("Please select a shelter and ensure your location is available");
    }
  };

  const handleShowRouteFromPopup = (shelter: Shelter, mode: TravelMode) => {
    if (currentLocation) {
      const travelMode = google.maps.TravelMode[mode];
      displayDirections(shelter, travelMode);
      setIsPopupOpen(false);
      setIsRouteDisplayed(true);
    } else {
      toast.error("Please ensure your location is available");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {isLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}
      
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Map Container */}
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <div id="map" className="w-full h-[75vh]"></div>
        </div>
        
        {/* Controls Container */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
              transition duration-300 shadow-md hover:shadow-lg"
              onClick={refreshLocation}
            >
              <div className="flex items-center gap-2">
                <MdMyLocation className="w-5 h-5" />
                Location
              </div>
            </button>
            
            {permission === 'edit' && (
              <button
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 
                transition duration-300 shadow-md hover:shadow-lg"
                onClick={handleSaveShelters}
              >
                <div className="flex items-center gap-2">
                  <MdSave className="w-5 h-5" />
                  Save
                </div>
              </button>
            )}
            
            <button
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 
              transition duration-300 shadow-md hover:shadow-lg"
              onClick={() => findNearestShelter(google.maps.TravelMode.DRIVING)}
            >
              <div className="flex items-center gap-2">
                <MdDirectionsCar className="w-5 h-5" />
                Drive
              </div>
            </button>
            
            <button
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
              transition duration-300 shadow-md hover:shadow-lg"
              onClick={() => findNearestShelter(google.maps.TravelMode.WALKING)}
            >
              <div className="flex items-center gap-2">
                <MdDirectionsWalk className="w-5 h-5" />
                Walk
              </div>
            </button>
            
            <button
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
              transition duration-300 shadow-md hover:shadow-lg"
              onClick={() => setIsSelectingShelter(true)}
            >
              <div className="flex items-center gap-2">
                <MdRoute className="w-5 h-5" />
                Show Route
              </div>
            </button>

            {isSelectingShelter && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold mb-4">Select a Shelter</h3>
                  
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={selectedDestination?._id || ""}
                    onChange={(e) => {
                      const shelter = shelters.find(s => s._id === e.target.value);
                      setSelectedDestination(shelter || null);
                    }}
                  >
                    <option value="">Select a shelter...</option>
                    {shelters.map((shelter) => (
                      <option key={shelter._id} value={shelter._id}>
                        {shelter.name}
                      </option>
                    ))}
                  </select>

                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Travel Mode
                    </label>
                    <div className="flex gap-3">
                      <button
                        className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2
                          ${selectedTravelMode === 'DRIVING'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } transition-colors duration-200`}
                        onClick={() => setSelectedTravelMode('DRIVING')}
                      >
                        <MdDirectionsCar className="w-5 h-5" />
                        Drive
                      </button>
                      <button
                        className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2
                          ${selectedTravelMode === 'WALKING'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } transition-colors duration-200`}
                        onClick={() => setSelectedTravelMode('WALKING')}
                      >
                        <MdDirectionsWalk className="w-5 h-5" />
                        Walk
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      onClick={() => {
                        setIsSelectingShelter(false);
                        setSelectedDestination(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                      disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      disabled={!selectedDestination}
                      onClick={() => selectedDestination && handleShowRoute(selectedDestination)}
                    >
                      Show Route
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {isRouteDisplayed && (
              <button
                className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 
                focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 
                transition duration-300 shadow-md hover:shadow-lg"
                onClick={clearRoute}
              >
                <div className="flex items-center gap-2">
                  <MdClose className="w-5 h-5" />
                  Clear
                </div>
              </button>
            )}
          </div>
        </div>
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
          onShowRoute={handleShowRouteFromPopup}
        />
      )}
    </div>
  );
};

export default MapWithShelters;