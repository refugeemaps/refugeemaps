import config from '../config/config';
import getIcon from '../libs/get-icon';

/* global google */

export default class {
  /**
   * Constructs the map
   */
  constructor({
    onHotspotClick = () => {}
  }) {
    const $container = document.querySelector('.map'),
      options = {
        center: config.defaultLocation,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        zoom: 15
      };

    this.mapCanvas = new google.maps.Map($container, options);
    this.markers = [];
    this.onHotspotClick = onHotspotClick;
  }

  /**
   * Show the users position
   * @param {Object} position The position of the user
   */
  showUserPosition(position) {
    this.mapCanvas.setCenter(position);

    if (this.userMarker) {
      this.userMarker.setPosition(position);
      this.userMarker.setMap(this.mapCanvas);
      return;
    }

    this.userMarker = new google.maps.Marker({
      map: this.mapCanvas,
      clickable: false,
      label: 'You are here',
      icon: getIcon('user'),
      position
    });
  }

  /**
   * Update the hotspots
   * @param  {Array} currentFilters The current selected filters
   */
  updateHotspots(currentFilters) {
    if (currentFilters.length === 0) {
      this.markers.forEach(marker => marker.setVisible(true));
      return;
    }

    this.markers.forEach(marker => {
      const isInFilters = currentFilters.indexOf(marker.hotspot.type) >= 0;

      marker.setVisible(isInFilters);
    });
  }

  /**
   * Add a marker for every hotspot
   * @param {Object} hotspots Array with the hotspots infos
   */
  addHotspots(hotspots) {
    hotspots.forEach(hotspot => {
      const position = {
          lat: parseFloat(hotspot.lat),
          lng: parseFloat(hotspot.lng)
        },
        icon = getIcon(hotspot.type),
        marker = new google.maps.Marker({
          map: this.mapCanvas,
          icon,
          position
        });

      marker.hotspot = hotspot;

      marker.addListener('click', () => {
        this.onHotspotClick(hotspot);
      });

      this.markers.push(marker);
    });
  }

  /**
   * Set the center of the map
   * @param {Object} position The position which should be centered
   */
  setCenter(position) {
    this.mapCanvas.setCenter(position);
  }
}
