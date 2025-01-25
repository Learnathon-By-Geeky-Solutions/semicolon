import React from "react";
import MapWithClickableCustomMarkers from "../components/googleMaps/markerMap";

const Shelters: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-100 flex">
        <MapWithClickableCustomMarkers></MapWithClickableCustomMarkers>
    </div>
  );
};

export default Shelters;
