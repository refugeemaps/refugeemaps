import Promise from 'lie';
import Map from './map';
import config from './config';
import getData from './get-data';
import findClosestCity from './find-closest-city';
import Sidebar from './sidebar';

class App {
  /**
   * Constructs the app.
   */
  constructor() {
    const hash = window.location.hash.toLowerCase().substr(1);

    this.map = new Map('.map');

    if (hash) {
      getData({spreadsheetId: config.citySpreadsheetId})
        .then(cities => this.selectCity(cities, hash))
        .then(city => getData({spreadsheetId: city.spreadsheetId}))
        .then(hotspots => this.onHotspotsLoaded(hotspots))
        .catch(error => this.handlePromiseError(error));
    } else {
      Promise.all([
        getData({spreadsheetId: config.citySpreadsheetId}),
        this.getUserLocation()
      ])
        .then(([cities, position]) => findClosestCity(cities, position))
        .then(city => getData({spreadsheetId: city.spreadsheetid}))
        .then(hotspots => this.onHotspotsLoaded(hotspots))
        .catch(error => this.handlePromiseError(error));
    }

    window.onhashchange = function() {
      window.location.reload();
    };
  }

  /**
   * Select a city based on the url hash. If a wrong one
   * is provided, use the first city in the document
   * @param {Object} cities The cities object
   * @param {String} hash The url hash
   * @return {Promise} Promise with the city
   */
  selectCity(cities, hash) {
    let cityExists = false;

    return new Promise(resolve => {
      cities.forEach(item => {
        let city = item.city.toLowerCase();

        if (city === hash) {
          cityExists = true;

          this.centerCity(item);
          resolve(item);
        }
      });

      if (!cityExists) {
        this.centerCity(cities[0]);
        resolve(cities[0]);
      }
    });
  }

  /**
   * Center the given city on the map
   * @param {Object} city The city
   */
  centerCity(city) {
    this.map.setCenter({
      lat: parseFloat(city.lat),
      lng: parseFloat(city.lng)
    });
  }

  /**
   * Kick off for adding the hotspots to the map
   * @param {Object} hotspotsData hotspots data
   */
  onHotspotsLoaded(hotspotsData) {
    this.map.addHotspots(hotspotsData);
    /* eslint-disable no-new  */
    new Sidebar(this.map, '.sidebar__filters', hotspotsData);
    /* eslint-enable no-new  */
  }

  /**
   * Get the user location
   * @return {Promise} Promise with the user location
   */
  getUserLocation() {
    return new Promise(resolve => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          this.markUserLocation(pos);
          resolve(pos);
        }, () => {
          this.handleLocationError(true, this.map.getCenter());
          resolve(this.map.getDefaultLocation());
        });
      } else {
        this.handleLocationError(false, this.map.getCenter());
        resolve(this.map.getDefaultLocation());
      }
    });
  }

  /**
   * Add a marker to the map at the current user position
   * @param {GoogleLatLng} position The user position
   */
  markUserLocation(position) {
    const infoWindowContent = 'You are here';

    this.map.addMarker({
      latLng: position,
      type: 'user',
      query: `${position.lat.toString()}, ${position.lng.toString()}`,
      infoWindowContent: infoWindowContent,
      showInfoWindow: true
    });
    this.map.setCenter(position);
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

  /**
   * Log the error the the console
   * @param {Error} error The errow that was thrown
   */
  handlePromiseError(error) {
    console.error('Something went wrong: ', error); // eslint-disable-line
  }
}

window.app = new App();
