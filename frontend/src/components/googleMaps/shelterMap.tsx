import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { GOOGLE_MAPS_API_KEY } from "../../constants/paths";
import { Loader } from "@googlemaps/js-api-loader";
import { ResourcePopup } from "./resourcePopup";
import { Location, Shelter, NewShelter, MapWithSheltersProps, TravelMode } from "../../types/shelterMapTypes";
import { getShelters, saveShelters } from "../../helpers/shelter";
import LoadingSpinner from "../loadingSpinner";
import { MdMyLocation, MdSave, MdDirectionsCar, MdDirectionsWalk, MdClose, MdRoute } from "react-icons/md";
import { useAuthStore } from "../../store/authStore";
import { getDistrictById } from "../../helpers/district";
import { District } from "../../types/districtTypes";

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ["places", "marker"],
});

const center = {
  lat: -34.397,
  lng: 150.644,
};

const MapWithShelters: React.FC<MapWithSheltersProps> = ({ permission }) => {
  const { user } = useAuthStore();

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
  const [district, setDistrict] = useState<District | null>(null);

  const initializeShelterCount = () => {
    shelterCountRef.current = shelters.length;
  };

  useEffect(() => {
    console.log("Current district state:", district);
  }, [district]);

  useEffect(() => {
    const fetchDistrict = async () => {
      try {
        if (user && user.district_id) {
          console.log("Fetching district for user:", user.district_id);
          const fetchedDistrict = await getDistrictById(user.district_id);
          console.log("Fetched district:", fetchedDistrict);
          if (fetchedDistrict && fetchedDistrict._id) {
            setDistrict(fetchedDistrict);
          } else {
            console.error("Invalid district data received");
            toast.error("Error loading district information");
          }
        }
      } catch (error) {
        console.error("Error fetching district:", error);
        toast.error("Error loading district information");
      }
    };

    if (user) {
      fetchDistrict();
    }
  }, [user]);

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
      if (permission === 'edit' && district) {
        map.addListener("click", async (event: google.maps.MapMouseEvent) => {
          const clickedLocation = event.latLng;
          if (!clickedLocation) return;
          
          console.log("Current district when creating shelter:", district);

          // Strict check for district
          if (!district || !district._id) {
            toast.error("No district assigned. Please contact an administrator.");
            return;
          }

          shelterCountRef.current += 1;
          

          const newShelter: NewShelter & { _id: string } = {
            _id: `temp-${Date.now()}`,
            name: `Shelter ${shelterCountRef.current}`,
            lat: clickedLocation.lat(),
            lng: clickedLocation.lng(),
            district_id: district._id,
            district_name: district.district_name,
            food: 0,
            water: 0,
            medicine: 0,
          };

          console.log("New shelter being created:", newShelter);

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

    if (district) {
      loadMapAndShelters();
    }

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.map = null);
      markersRef.current.clear();
    };
  }, [district]);

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
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}
      
      <div className="flex-1 p-4 space-y-4">
        {/* Map Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white p-1 h-[calc(100vh-12rem)]">
          <div id="map" className="w-full h-full rounded-xl" />
        </div>
        
        {/* Controls Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-4 flex flex-wrap gap-3 justify-start">
            <button
              className="inline-flex items-center px-4 py-2.5 bg-green-600 text-white rounded-lg
              hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow
              font-medium text-sm gap-2"
              onClick={refreshLocation}
            >
              <MdMyLocation className="w-5 h-5" />
              <span>My Location</span>
            </button>
            
            <button
              className="inline-flex items-center px-4 py-2.5 bg-green-600 text-white rounded-lg
              hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow
              font-medium text-sm gap-2"
              onClick={() => findNearestShelter(google.maps.TravelMode.DRIVING)}
            >
              <MdDirectionsCar className="w-5 h-5" />
              <span>Find Nearest (Drive)</span>
            </button>
            
            <button
              className="inline-flex items-center px-4 py-2.5 bg-green-600 text-white rounded-lg
              hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow
              font-medium text-sm gap-2"
              onClick={() => findNearestShelter(google.maps.TravelMode.WALKING)}
            >
              <MdDirectionsWalk className="w-5 h-5" />
              <span>Find Nearest (Walk)</span>
            </button>
            
            <button
              className="inline-flex items-center px-4 py-2.5 bg-green-600 text-white rounded-lg
              hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow
              font-medium text-sm gap-2"
              onClick={() => setIsSelectingShelter(true)}
            >
              <MdRoute className="w-5 h-5" />
              <span>Plan Route</span>
            </button>
            
            {isRouteDisplayed && (
              <button
                className="inline-flex items-center px-4 py-2.5 bg-rose-500 text-white rounded-lg
                hover:bg-rose-600 transition-all duration-200 shadow-sm hover:shadow
                font-medium text-sm gap-2"
                onClick={clearRoute}
              >
                <MdClose className="w-5 h-5" />
                <span>Clear Route</span>
              </button>
            )}

            {permission === 'edit' && (
              <button
                className="inline-flex items-center px-4 py-2.5 ml-auto bg-green-700 text-white rounded-lg
                hover:bg-green-800 shadow-sm transition-all duration-200"
                onClick={handleSaveShelters}
              >
                <MdSave className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            )}
          </div>
        </div>

        {/* Shelter Selection Modal */}
        {isSelectingShelter && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50
            animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4
              animate-[slideIn_0.3s_ease-out]">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Plan Your Route</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Destination
                  </label>
                  <select
                    className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={selectedDestination?._id || ""}
                    onChange={(e) => {
                      const shelter = shelters.find(s => s._id === e.target.value);
                      setSelectedDestination(shelter || null);
                    }}
                  >
                    <option value="">Choose a shelter...</option>
                    {shelters.map((shelter) => (
                      <option key={shelter._id} value={shelter._id}>
                        {shelter.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Mode
                  </label>
                  <div className="flex gap-3">
                    <button
                      className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2
                        transition-all duration-200 ${
                          selectedTravelMode === 'DRIVING'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      onClick={() => setSelectedTravelMode('DRIVING')}
                    >
                      <MdDirectionsCar className="w-5 h-5" />
                      Drive
                    </button>
                    <button
                      className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2
                        transition-all duration-200 ${
                          selectedTravelMode === 'WALKING'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      onClick={() => setSelectedTravelMode('WALKING')}
                    >
                      <MdDirectionsWalk className="w-5 h-5" />
                      Walk
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  onClick={() => {
                    setIsSelectingShelter(false);
                    setSelectedDestination(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                  shadow-sm hover:shadow font-medium"
                  disabled={!selectedDestination}
                  onClick={() => selectedDestination && handleShowRoute(selectedDestination)}
                >
                  Show Route
                </button>
              </div>
            </div>
          </div>
        )}

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
    </div>
  );
};

export default MapWithShelters;