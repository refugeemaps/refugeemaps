/* global google */

/**
 * General configuration
 */
export default {
  poisApiUrl: '/_api/hotspots/{{location}}.json',
  defaultLocation: {
    lat: 53.560022,
    lng: 9.977840
  },
  markerBackground: {
    path: 'M0.5,0m-15,0a15,15 0 1,0 30,0a15,15 0 1,0-30,0',
    fillColor: '#F44336',
    fillOpacity: 1,
    scale: 1,
    strokeColor: '#FFF',
    strokeWeight: 2
  },
  userIcon: {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#2196f3',
    fillOpacity: 1,
    scale: 8,
    strokeColor: 'white',
    strokeOpacity: 0.5,
    strokeWeight: 6
  }
};
