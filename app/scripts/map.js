/* global google */

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
      zoom: 14
    };
    this.gMap = new google.maps.Map(this.$container, this.options);
  }

  /**
   * Add a marker to the map
   * @param {Object} latLng The position of the marker
   * @param {String} infoWindowContent The infowindow content (optional)
   */
  addMarker(latLng, infoWindowContent = false) {
    let marker = new google.maps.Marker({
      position: latLng
    });

    marker.setMap(this.gMap);

    if (infoWindowContent) {
      this.addInfoWindow(latLng, infoWindowContent, marker);
    }
  }

  /**
   * Add an infowindow to the map
   * @param {Object} latLng The position of the marker
   * @param {String} infoWindowContent The infowindow content (optional)
   * @param {GoogleMarker} marker Optional marker this window is bound to
   */
  addInfoWindow(latLng, infoWindowContent, marker = false) {
    let infoWindow = new google.maps.InfoWindow({map: this.gMap});
    infoWindow.setContent(infoWindowContent);

    if (marker) {
      infoWindow.open(this.gMap, marker);
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
