import Map from './map';

class App {
  /**
   * Constructs the app.
   */
  constructor() {
    this.map = new Map('.map');
    this.markUserLocation();
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

        this.map.addMarker(userPos, infoWindowContent);
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
      this.map.addInfoWindow(pos, 'Error: The Geolocation service failed.');
    } else {
      this.map.addInfoWindow(
        pos,
        'Error: Your browser doesn\'t support geolocation.'
      );
    }
  }
}

/* eslint-disable no-unused-vars */
let app = new App();
/* eslint-enable no-unused-vars */
