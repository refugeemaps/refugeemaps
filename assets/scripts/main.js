/* globals google */
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
      })
      .catch(error => this.handleError(error));

    if (location.hash === '#print') {
      location.hash = '';
    }
    window.onhashchange = () => this.onHashHandle();
  }

  /**
   * Handle hash change events.
   */
  onHashHandle() {
    const {hash} = location;
    document.body.classList.toggle('print', hash === '#print');
    if (hash !== '#print') {
      return;
    }
    let mapBounds = this.map.getBounds(),
      reducedHotspots = this.hotspots.filter(hotspot => {
        return mapBounds.contains(
          new google.maps.LatLng(hotspot.position.lat,
            hotspot.position.lng)
        );
      }),
      el = document.createElement('link');
    this.menu.hide();
    if (reducedHotspots.length >= 26) {
      reducedHotspots = reducedHotspots.sort((a, b) => {
        let defaultLocation = mapBounds.getCenter();
        return distance(
          a.position.lng, a.position.lat,
          defaultLocation.lng(), defaultLocation.lat()
        ) - distance(b.position.lng, b.position.lat,
          defaultLocation.lng(), defaultLocation.lat()
        );
      }).splice(0, 26);
    }
    el.rel = 'stylesheet';
    el.href = '/static/print.css';
    if (!this.printView) {
      document.head.appendChild(el);
    }
    this.printView = new Print('print-view', reducedHotspots);
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
    this.error.show('Unable to load Map Data', true);
    console.error(message);
  }
}

window.app = new App();

function distance(lon1, lat1, lon2, lat2) {
  var R = 6371, // Radius of the earth in km
    dLat = toRad(lat2 - lat1),  // Javascript functions in radians
    dLon = toRad(lon2 - lon1),
    a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2),
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
    d = R * c; // Distance in km
  return d;
}

function toRad(n) {
  return n * Math.PI / 180;
}
