export interface Location {
    lat: number;
    lng: number;
  }
  
  export interface Disaster {
    id: string;
    type: string;
    location: Location;
    frequency?: number;
    date?: string;
    // Add any other properties your disaster objects have
  }
  
  export interface DisasterContextType {
    disasters: Disaster[];
    filterType: string;
  }