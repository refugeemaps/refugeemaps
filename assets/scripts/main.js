import Promise from 'lie';
import find from 'array-find';
import config from './config/config';
import getData from './libs/get-data';

import Map from './views/map';
import Loading from './views/loading';
import Error from './views/error';
import Actions from './views/actions';
import Filters from './views/filters';
import Infowindow from './views/infowindow';
import Menu from './views/menu';

class App {
  /**
   * Constructs the app.
   */
  constructor() {
    this.infowindow = new Infowindow();
    this.loading = new Loading();
    this.error = new Error();
    this.map = new Map({
      onHotspotClick: hotspot => this.infowindow.show(hotspot)
    });
    this.filters = new Filters({
      onFilterChange: currentFilter => this.map.updateHotspots(currentFilter)
    });
    this.menu = new Menu({
      onLanguageChange: language => this.filters.changeLanguage(language)
    });
    this.actions = new Actions({
      onMenuToggle: () => this.menu.toggle(),
      onFiltersToggle: () => this.filters.toggle(),
      onUserLocationSuccess: position => this.map.showUserPosition(position)
    });

    getData({spreadsheetId: window.citySpreadsheetId})
      .then(hotspots => this.onHotspotsLoaded(hotspots))
      .catch(error => this.handleError(error));

    window.onhashchange = function() {
      window.location.reload();
    };
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
   * Handle errors when geolocation fails
   * @param {String} message The error message
   */
  handleError(message) {
    this.error.show();
    console.error(message);
  }
}

window.app = new App();
