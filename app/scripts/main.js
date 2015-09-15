import Map from './map';
import Data from './data';
import Sidebar from './sidebar';

class App {
  /**
   * Constructs the app.
   */
  constructor() {
    const citySpreadsheet = '1pg-73mda1ZBtGZAFdkt2gh6XXCHxPuYnaWhNQbrcDx0',
      hash = window.location.hash;

    this.map = new Map('.map');

    this.data = new Data();

    this.fetchCities(citySpreadsheet)
      .then(cities => this.chooseCity(cities, hash))
      .then(city => this.getCityData(city)
      .then(hotspots => this.onHotspotsLoaded(hotspots))
      .catch(error => this.handlePromiseError(error)));

    window.onhashchange = function() {
      window.location.reload();
    };
  }

  /**
   * Fetch the available cities from a spreadsheet
   * @param {String} spreadsheetId The spreadsheet ID
   * @return {Promise} Promise with the cities
   */
  fetchCities(spreadsheetId) {
    let cityData = new Data();
    return cityData.get({
      sourceId: spreadsheetId,
      sheet: 'od6'
    });
  }

  /**
   * Choose one city based on the url hash. If none or a wrong one
   * is provided, use the first city
   * @param {Object} cities The cities object
   * @param {String} hash The url hash
   * @return {Promise} Promise with the city
   */
  chooseCity(cities, hash) {
    let cityExists = false;
    hash = hash.toLowerCase().substr(1);

    return new Promise(resolve => {
      cities.forEach(item => {
        let city = item.city.toLowerCase();

        if (city === hash) {
          cityExists = true;

          this.map.setCenter({
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lng)
          });

          resolve(item);
        }
      });

      if (!cityExists) {
        this.markUserLocation();
        resolve(cities[0]);
      }
    });
  }

  /**
   * Get the hotspot data from a single city
   * @param {Object} city The city object
   * @return {Promise} Promise with the city data
   */
  getCityData(city) {
    return this.getSpreadsheetData(city.spreadsheetid);
  }

  /**
   * Getting the data from the given spreadsheet
   * @param {String} spreadsheetId The spreadsheet ID
   * @return {Promise} Promise with the hotspot data
   */
  getSpreadsheetData(spreadsheetId) {
    return this.data.get({
      sourceId: spreadsheetId,
      sheet: 'od6'
    });
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
          query: `${userPos.lat.toString()}, ${userPos.lng.toString()}`,
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

  /**
   * Log the error the the console
   * @param {Error} error The errow that was thrown
   */
  handlePromiseError(error) {
    console.log('Something went wrong: ', error); // eslint-disable-line
  }
}

/* eslint-disable no-unused-vars */
let app = new App();
/* eslint-enable no-unused-vars */
