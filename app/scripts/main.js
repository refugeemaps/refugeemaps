import Map from './map';
import Data from './data';
import Sidebar from './sidebar';

class App {
  /**
   * Constructs the app.
   */
  constructor() {
    this.map = new Map('.map');

    this.data = new Data();
    this.defaultSpreadsheet = '1M5INJw-LvHfRzl0VleYVKWdiGOS1LE1uF-4ePlCQeYQ';

    this.hash = window.location.hash;

    if (this.hash) {
      this.cityData = new Data();
      this.citySpreadsheet = '1pg-73mda1ZBtGZAFdkt2gh6XXCHxPuYnaWhNQbrcDx0';
      this.cityData.get({
        sourceId: this.citySpreadsheet,
        sheet: 'od6'
      }).then(cityData => this.onCitiesLoaded(cityData, this.hash));
    } else {
      this.loadDefaultData();
    }

    window.onhashchange = function() {
      window.location.reload();
    };
  }

  /**
   * Check if given city exists in spreadsheet. If yes, load the data.
   * @param {Object} cityData Cities data
   * @param {String} hash The URL hash
   */
  onCitiesLoaded(cityData, hash) {
    let cityExists = false;
    hash = hash.toLowerCase().substr(1);

    cityData.forEach(item => {
      let city = item.city.toLowerCase();

      if (city === hash) {
        this.getSpreadsheetData(item.spreadsheetid);

        this.map.setCenter({
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lng)
        });

        cityExists = true;
      }
    });

    if (!cityExists) {
      this.loadDefaultData();
    }
  }

  /**
   * If no/wrong hash is set, load default data (hamburg) and mark user position
   */
  loadDefaultData() {
    this.markUserLocation();
    this.getSpreadsheetData(this.defaultSpreadsheet);
  }

  /**
   * Getting the data from the given spreadsheet
   * @param {String} spreadsheetId The spreadsheet ID
   */
  getSpreadsheetData(spreadsheetId) {
    this.data.get({
      sourceId: spreadsheetId,
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
}

/* eslint-disable no-unused-vars */
let app = new App();
/* eslint-enable no-unused-vars */
