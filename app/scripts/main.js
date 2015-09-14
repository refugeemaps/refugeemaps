import Map from './map';
import Data from './data';
import Sidebar from './sidebar';

class App {
  /**
   * Constructs the app.
   */
  constructor() {
    this.map = new Map('.map');

    this.markUserLocation();

    this.data = new Data();

    this.spreadsheetKey = '1M5INJw-LvHfRzl0VleYVKWdiGOS1LE1uF-4ePlCQeYQ';

    this.data.get({
      sourceId: this.spreadsheetKey,
      sheet: 'od6'
    }).then(hotspotsData => this.onHotspotsLoaded(hotspotsData));
  }

  /**
   * Kick off for adding the hotspots to the map
   * @param {Object} hotspotsData hotspots data
   */
  onHotspotsLoaded(hotspotsData) {
    this.map.addHotspots(hotspotsData);
    /* eslint-disable no-new  */
    new Sidebar(this.map, '.sidebar__keys', hotspotsData);
    /* eslint-enable no-new  */
  }

  /**
   * Add a marker to the map at the current user position
   */
  markUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          infoWindowContent = 'You are here';

        this.map.addMarker({
          latLng: userPos,
          type: 'user',
          infoWindowContent: infoWindowContent,
          showInfoWindow: true
        });
        this.map.setCenter(userPos);
      }, () => {
        this.handleLocationError(true, this.map.getCenter());
      });
    } else {
      this.handleLocationError(false, this.map.getCenter());
    }
  }

  /**
   * Handle errors when geolocation fails
   * @param {Boolean} browserHasGeolocation If the browser supports geolocation
   * @param {Object} pos Position where the error infowindow will be placed
   */
  handleLocationError(browserHasGeolocation, pos) {
    if (browserHasGeolocation) {
      this.map.addInfoWindow({
        latLng: pos,
        infoWindowContent: 'Error: The Geolocation service failed.'
      });
    } else {
      this.map.addInfoWindow({
        latLng: pos,
        infoWindowContent: 'Error: Your browser doesn\'t support geolocation.'
      });
    }
  }
}

/* eslint-disable no-unused-vars */
let app = new App();
/* eslint-enable no-unused-vars */
