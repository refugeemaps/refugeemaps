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
      if (hash) {
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
      } else {
        this.markUserLocation();
        this.findClosestCity(cities)
          .then(resolve)
          .catch(error => this.handlePromiseError(error));
      }

      if (!cityExists) {
        this.markUserLocation();
        resolve(cities[0]);
      }
    });
  }

  /**
   * Find the closest city/spreadsheet to the user location.
   * Using the Haversine formula to calc distance between locations.
   * @param {Object} cities The cities object
   * @return {Promise} Promise with the closest city
   */
  findClosestCity(cities) {
    return new Promise((resolve, reject) => {
      this.getUserLocation()
        .then(userLocation => {
          let userLat = userLocation.lat,
            userLng = userLocation.lng,
            r = 6371, // radius of earth in km
            distances = [],
            closestIndex = -1,
            closestCity = '';

          cities.forEach((city, index) => {
            let cityLat = city.lat,
              cityLng = city.lng,
              dLat = this.rad(cityLat - userLat),
              dLong = this.rad(cityLng - userLng),
              a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.rad(userLat)) * Math.cos(this.rad(userLat))
                * Math.sin(dLong / 2) * Math.sin(dLong / 2),
              c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
              d = r * c;

            distances[index] = d;

            if (closestIndex === -1 || d < distances[closestIndex]) {
              closestIndex = index;
              closestCity = city;
            }
          });
          resolve(closestCity);
        })
        .catch(reject);
    });
  }

  /**
   * Convert from degrees to radians
   * @param {Float} x The degrees value
   * @return {Float} The radian value
   */
  rad(x) {
    return x * Math.PI / 180;
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
   * Get the user location
   * @return {Promise} Promise with the user location
   */
  getUserLocation() {
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(position => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude});
      });
    });
  }

  /**
   * Add a marker to the map at the current user position
   */
  markUserLocation() {
    if (navigator.geolocation) {
      this.getUserLocation()
        .then(userPos => {
          const infoWindowContent = 'You are here';

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
        })
        .catch(error => this.handlePromiseError(error));
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
