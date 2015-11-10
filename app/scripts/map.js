import config from './config';
import getIcon from './get-icon';
import mapStyle from './map-style';

/* global google */

export default class Map {
  /**
   * Constructs the map
   */
  constructor() {
    const $container = document.querySelector('.map'),
      options = {
        center: config.defaultLocation,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        streetViewControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        styles: mapStyle,
        zoom: 15
      };

    this.mapCanvas = new google.maps.Map($container, options);
    this.markers = [];
  }

  /**
   * Add a marker to the map
   * @param {Object} latLng The position of the marker
   * @param {String} type The location type
   * @param {String} query The location query (name + adress)
   * @param {String} infoWindowContent The infowindow content (optional)
   * @param {Booloean} showInfoWindow If the window should be open or not
   */
  addMarker({
    latLng,
    type,
    query,
    infoWindowContent = null,
    showInfoWindow = null
  }) {
    let icon = getIcon(type),
      marker = new google.maps.Marker({
        icon: icon,
        place: {
          location: latLng,
          query: query
        }
      });

    if (type !== 'user') {
      this.markers.push(marker);
    }

    marker.setMap(this.mapCanvas);

    if (infoWindowContent) {
      this.addInfoWindow({
        latLng: latLng,
        infoWindowContent: infoWindowContent,
        marker: marker,
        showInfoWindow: showInfoWindow
      });
    }
  }

  /**
   * Show or hide markers. Pass in 'null' to remove all markers
   */
  resetMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  /**
   * Update the hotspots
   * @param  {Array} currentFilters The current selected filters
   */
  updateHotspots(currentFilters) {
    let filteredData = [];

    currentFilters.forEach(filter => {
      this.hotspotsData.forEach(hotspot => {
        if (hotspot.type === filter) {
          filteredData.push(hotspot);
        }
      });
    });

    if (filteredData.length > 0) {
      this.addHotspots(filteredData);
    } else {
      this.addHotspots(this.hotspotsData);
    }
  }

  /**
   * Add a marker for every hotspot
   * @param {Object} hotspotsData Array with the hotspots infos
   */
  addHotspots(hotspotsData) {
    this.hotspotsData = hotspotsData;
    this.resetMarkers();

    hotspotsData.forEach(hotspot => {
      const position = {
        lat: parseFloat(hotspot.lat),
        lng: parseFloat(hotspot.lng)
      };
      let content = '<div class="infowindow">';

      if (hotspot.name) {
        content += `<h4 class="infowindow__title">${hotspot.name}</h4><hr>`;
      }

      if (hotspot.address) {
        content += `<div class="infowindow__address">
          <img src="assets/marker-stroked-24@2x.png"
            class="infowindow__address__image">
          <span class="infowindow__address__text">${hotspot.address}</span>
        </div><hr>`;
      }

      if (hotspot.descriptionenglish) {
        content += `<div class="infowindow__description">
          ${hotspot.descriptionenglish}</div><hr>`;
      }

      if (hotspot.descriptionforeign) {
        content += `<div class="infowindow__description">
          ${hotspot.descriptionforeign}</div><hr>`;
      }

      if (hotspot.openinghours) {
        content += `<div class="infowindow__hours">
          <img src="assets/clock.png" class="infowindow__hours__image">
          <span class="infowindow__hours__text">${hotspot.openinghours}</span>
        </div>`;
      }

      content += '</div>';

      this.addMarker({
        latLng: position,
        type: hotspot.type,
        query: hotspot.name + ', ' + hotspot.address,
        infoWindowContent: content
      });
    });
  }

  /**
   * Add an infowindow to the map
   * @param {Object} latLng The position of the marker
   * @param {String} infoWindowContent The infowindow content (optional)
   * @param {GoogleMarker} marker Optional marker this window is bound to
   * @param {Boolean} showInfoWindow If the window should be open or not
   */
  addInfoWindow({latLng, infoWindowContent, marker = null,
      showInfoWindow = null}) {
    let infoWindow = new google.maps.InfoWindow({map: this.mapCanvas});
    infoWindow.setContent(infoWindowContent);

    if (marker) {
      if (showInfoWindow) {
        infoWindow.open(this.mapCanvas, marker);
      } else {
        infoWindow.close();
      }

      marker.addListener('click', () => {
        infoWindow.open(this.mapCanvas, marker);
      });
    } else {
      infoWindow.setPosition(latLng);
    }
  }

  /**
   * Get the center of the map
   * @returns {GoogleLatLng}
   */
  getCenter() {
    return this.mapCanvas.getCenter();
  }

  /**
   * Set the center of the map
   * @param {Object} position The position which should be centered
   */
  setCenter(position) {
    this.mapCanvas.setCenter(position);
  }
}
