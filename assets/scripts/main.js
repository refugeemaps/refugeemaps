import getPois from './libs/get-pois';

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
      onPoiClick: poi => this.infowindow.show(poi)
    });
    this.filters = new Filters({
      onFilterChange: currentFilter => this.map.updatePois(currentFilter)
    });
    this.menu = new Menu({
      onLanguageChange: language => this.onLanguageChange(language)
    });
    this.actions = new Actions({
      onMenuToggle: () => this.menu.toggle(),
      onFiltersToggle: () => this.filters.toggle(),
      onUserLocationSuccess: position => this.map.showUserPosition(position)
    });

    getPois()
      .then(pois => this.onPoisLoaded(pois))
      .catch(error => this.handleError(error));

    window.onhashchange = function() {
      window.location.reload();
    };
  }

  /**
   * When the language got changed
   * @param  {String} language The new language
   */
  onLanguageChange(language) {
    this.filters.changeLanguage(language);
    this.infowindow.changeLanguage(language);
  }

  /**
   * Finally initialize the map
   * @param {Object} pois The pois data
   */
  onPoisLoaded(pois) {
    this.map.addPois(pois);
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
