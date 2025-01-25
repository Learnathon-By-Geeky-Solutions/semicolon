import { Loader } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_API_KEY } from '../../constants/paths';
const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ['places'],
  id: '__googleMapsScriptId',
});

export default loader;