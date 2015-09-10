import Icons from './icons';
import mapStyle from './map-style';

/* global google MarkerClusterer */

export default class Map {
  /**
   * Constructs the map
   * @param {String} selector The selector for the map
   */
  constructor(selector) {
    this.$container = document.querySelector(selector);
    this.options = {
      center: {
        lat: 53.560022,
        lng: 9.977840
      },
      styles: mapStyle,
      zoom: 15
    };
    this.gMap = new google.maps.Map(this.$container, this.options);
    this.markers = [];
    this.icons = new Icons();
  }

  /**
   * Add a marker to the map
   * @param {Object} latLng The position of the marker
   * @param {String} type The location type
   * @param {String} infoWindowContent The infowindow content (optional)
   * @param {Booloean} showInfoWindow If the window should be open or not
   */
  addMarker({latLng, type, infoWindowContent = null, showInfoWindow = null}) {
    let icon = this.icons.getIconByType(type),
      marker = new google.maps.Marker({
        position: latLng,
        icon: icon
      });

    this.markers.push(marker);

    marker.setMap(this.gMap);

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
   * Add a marker for every hotspot
   * @param {Object} hotspotsData Array with the hotspots infos
   */
  addHotspots(hotspotsData) {
    hotspotsData.forEach(hotspot => {
      let position = {
          lat: parseFloat(hotspot.lat),
          lng: parseFloat(hotspot.lng)
        },
        infoWindowContent = '<div class="infowindow">';

      if (hotspot.name) {
        infoWindowContent += '<h4>' + hotspot.name + '</h4>';
      }

      if (hotspot.adress) {
        infoWindowContent += '<div>' + hotspot.adress + '</div>';
      }

      if (hotspot.descriptionenglish) {
        infoWindowContent += '<div>' + hotspot.descriptionenglish + '</div>';
      }

      if (hotspot.descriptionforeign) {
        infoWindowContent += '<div>' + hotspot.descriptionenglish + '</div>';
      }

      if (hotspot.openinghours) {
        infoWindowContent += '<div>' + hotspot.openinghours + '</div>';
      }

      infoWindowContent += '</div>';

      this.addMarker({
        latLng: position,
        type: hotspot.type,
        infoWindowContent: infoWindowContent
      });
    });
    /* eslint-disable no-new  */
    new MarkerClusterer(this.gMap, this.markers);
    /* eslint-enable no-new  */
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
    let infoWindow = new google.maps.InfoWindow({map: this.gMap});
    infoWindow.setContent(infoWindowContent);

    if (marker) {
      if (showInfoWindow) {
        infoWindow.open(this.gMap, marker);
      } else {
        infoWindow.close();
      }

      marker.addListener('click', () => {
        infoWindow.open(this.gMap, marker);
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
    return this.gMap.getCenter();
  }

  /**
   * Set the center of the map
   * @param {Object} position The position which should be centered
   */
  setCenter(position) {
    this.gMap.setCenter(position);
  }
}
