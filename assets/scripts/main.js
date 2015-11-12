import Promise from 'lie';
import find from 'array-find';
import config from './config/config';
import getData from './libs/get-data';
import findClosestCity from './libs/find-closest-city';

import Map from './views/map';
import Loading from './views/loading';
import Error from './views/error';
import Actions from './views/actions';
import Filters from './views/filters';
import Infowindow from './views/infowindow';
import LanguageSwitch from './views/language-switch';

class App {
  /**
   * Constructs the app.
   */
  constructor() {
    const hash = window.location.hash.toLowerCase().substr(1);

    this.infowindow = new Infowindow();
    this.loading = new Loading();
    this.error = new Error();
    this.map = new Map({
      onHotspotClick: hotspot => this.infowindow.show(hotspot)
    });
    this.filters = new Filters({
      onFilterChange: currentFilter => this.map.updateHotspots(currentFilter)
    });
    this.languageSwitch = new LanguageSwitch({
      onLanguageChange: language => this.filters.changeLanguage(language)
    });
    this.actions = new Actions({
      onFiltersToggle: () => this.filters.toggle(),
      onCenter: () => this.map.showUserPosition()
    });

    if (hash) {
      getData({spreadsheetId: config.citySpreadsheetId})
        .then(cities => this.selectCity(cities, hash))
        .then(city => this.centerOnCity(city))
        .then(city => getData({spreadsheetId: city.spreadsheetid}))
        .then(hotspots => this.onHotspotsLoaded(hotspots))
        .catch(error => this.handleError(error));
    } else {
      Promise.all([
        getData({spreadsheetId: config.citySpreadsheetId}),
        this.getUserLocation()
      ])
        .then(([cities, position]) => findClosestCity(cities, position))
        .then(city => getData({spreadsheetId: city.spreadsheetid}))
        .then(hotspots => this.onHotspotsLoaded(hotspots))
        .catch(error => this.handleError(error));
    }

    getData({spreadsheetId: config.categoriesSpreadsheetId})
      .then(categories => this.filters.renderCategories(categories))
      .catch(error => this.handleError(error));

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
    return new Promise(resolve => {
      const foundCity = find(cities, city => {
        return city.city.toLowerCase() === hash;
      });

      if (foundCity) {
        resolve(foundCity);
      } else {
        resolve(cities[0]);
      }
    });
  }

  /**
   * Center the given city on the map
   * @param {Object} city The city
   * @return {Object} The city
   */
  centerOnCity(city) {
    this.map.setCenter({
      lat: parseFloat(city.lat),
      lng: parseFloat(city.lng)
    });
    return city;
  }

  /**
   * Kick off for adding the hotspots to the map
   * @param {Object} hotspotsData hotspots data
   */
  onHotspotsLoaded(hotspotsData) {
    this.map.addHotspots(hotspotsData);
    this.loading.hide();
    this.actions.show();
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

          this.map.showUserPosition(pos);
          resolve(pos);
        }, () => {
          this.handleError();
          resolve(config.defaultLocation);
        });
      } else {
        this.handleError();
        resolve(config.defaultLocation);
      }
    });
  }

  /**
   * Handle errors when geolocation fails
   */
  handleError() {
    this.error.show();
  }
}

window.app = new App();
