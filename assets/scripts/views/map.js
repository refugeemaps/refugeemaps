import config from '../config/config';
import getIcon from '../libs/get-icon';

/* global google */

export default class {
  /**
   * Constructs the map
   */
  constructor({
    onPoiClick = () => {}
  }) {
    const $container = document.querySelector('.map'),
      options = {
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM
        }
      };

    this.mapCanvas = new google.maps.Map($container, options);
    this.markers = [];
    this.onPoiClick = onPoiClick;
  }

  /**
   * Show the users position
   * @param {Object} position The position of the user
   */
  showUserPosition(position) {
    if (!position && this.userMarker) {
      position = this.userMarker.getPosition();
    }

    this.mapCanvas.panTo(position);
    this.mapCanvas.setZoom(15);

    if (this.userMarker) {
      this.userMarker.setPosition(position);
      this.userMarker.setMap(this.mapCanvas);
      return;
    }

    this.userMarker = new google.maps.Marker({
      map: this.mapCanvas,
      clickable: false,
      zIndex: 5,
      icon: getIcon('user'),
      position
    });
  }

  /**
   * Update the pois
   * @param  {String} currentFilter The current selected filter
   */
  updatePois(currentFilter) {
    if (currentFilter === 'all') {
      this.markers.forEach(marker => marker.setVisible(true));
      return;
    }

    this.markers.forEach(marker => {
      const isActive = currentFilter === marker.poi.category;

      marker.setVisible(isActive);
    });
  }

  /**
   * Add a marker for every poi
   * @param {Object} pois Array with the pois infos
   */
  addPois(pois) {
    const bounds = new google.maps.LatLngBounds();

    pois.forEach(poi => {
      const position = new google.maps.LatLng(
          parseFloat(poi.position.lat),
          parseFloat(poi.position.lng)
        ),
        icon = getIcon(poi.category),
        background = new google.maps.Marker({
          map: this.mapCanvas,
          icon: config.markerBackground,
          zIndex: 1,
          position
        }),
        marker = new google.maps.Marker({
          map: this.mapCanvas,
          clickable: false,
          icon,
          zIndex: 1,
          position
        });

      background.poi = poi;
      marker.poi = poi;

      bounds.extend(position);

      background.addListener('click', () => {
        this.onPoiClick(poi);
      });

      this.markers.push(background);
      this.markers.push(marker);
    });

    this.mapCanvas.fitBounds(bounds);
  }

  /**
   * Set the center of the map
   * @param {Object} position The position which should be centered
   */
  setCenter(position) {
    this.mapCanvas.setCenter(position);
  }
}
