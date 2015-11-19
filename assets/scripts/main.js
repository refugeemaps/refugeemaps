import getHotspots from './libs/get-hotspots';

import Map from './views/map';
import Loading from './views/loading';
import Error from './views/error';
import Actions from './views/actions';
import Filters from './views/filters';
import Infowindow from './views/infowindow';
import Print from './views/print';
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
      onLanguageChange: language => this.onLanguageChange(language)
    });
    this.actions = new Actions({
      onMenuToggle: () => this.menu.toggle(),
      onFiltersToggle: () => this.filters.toggle(),
      onUserLocationSuccess: position => this.map.showUserPosition(position)
    });

    getHotspots()
      .then(hotspots => {
        this.onHotspotsLoaded(hotspots);
        this.onHashHandle();
      })
      .catch(error => this.handleError(error));

    window.onhashchange = this.onHashHandle.bind(this);
  }

  /**
   * Handle hash change events.
   */
  onHashHandle() {
    const {hash} = location;
    if (hash === '#print') {
      let mapBounds = this.map.getBounds(),
          reducedHotspots = this.hotspots.filter(hotspot => {
                return mapBounds.contains(
                    new google.maps.LatLng(hotspot.position.lat, hotspot.position.lng)
                );
      });
      this.menu.hide();
      if (reducedHotspots.length>26) {
        // add a message and forward to '/'
        this.error.show("too many markers in selection", false);
        // location.href = '/';
      } else {
        let el = document.createElement('link');
        el.rel = 'stylesheet';
        el.href = '/static/print.css';
        document.head.appendChild(el);
        document.body.classList.toggle('print', hash === '#print');

        this.printView = new Print('print-view', reducedHotspots);
      }
    }
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
   * @param {Object} hotspots The hotspots data
   */
  onHotspotsLoaded(hotspots) {
    this.hotspots = hotspots;
    this.map.addHotspots(hotspots);
    this.loading.hide();
    this.actions.show();
  }

  /**
   * Handle errors when geolocation fails
   * @param {String} message The error message
   */
  handleError(message) {
    this.error.show("Unable to load Map Data", true);
    console.error(message);
  }
}

window.app = new App();
