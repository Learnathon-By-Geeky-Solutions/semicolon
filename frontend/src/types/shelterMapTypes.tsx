export interface Location {
    name: string;
    lat: number;
    lng: number;
}
  
export interface Resource {
  food: number;
  water: number;
  medicine: number;
}

// For creating new shelters (POST requests)
export interface NewShelter {

  name: string;
  lat: number;
  lng: number;
  district_id: string;
  district_name: string;
  food: number;
  water: number;
  medicine: number;
}

// For existing shelters (GET responses)
export interface Shelter extends NewShelter {
  _id: string;
}

export interface MapWithSheltersProps {
  permission: 'view' | 'edit';
}
