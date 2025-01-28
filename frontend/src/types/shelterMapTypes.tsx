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

export interface Shelter {
  name: string;
  lat: number;
  lng: number;
  district_id: string;
  district_name: string;
  food: number;
  water: number;
  medicine: number;
}
