import React from "react";
import MapWithShelters from "../components/googleMaps/shelterMap.js";

const Shelters: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-100 flex">
        <MapWithShelters></MapWithShelters>
    </div>
  );
};

export default Shelters;
