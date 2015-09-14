import Icons from './icons';
import mapStyle from './map-style';

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
  addMarker({
    latLng,
    type,
    query,
    infoWindowContent = null,
    showInfoWindow = null
  }) {
    let icon = this.icons.getIconByType(type),
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
   * Show or hide markers. Pass in 'null' to remove all markers
   * @param {GoogleMap} map Map on which the markers should be set
   */
  setMarkers(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  /**
   * Add a marker for every hotspot
   * @param {Object} hotspotsData Array with the hotspots infos
   */
  addHotspots(hotspotsData) {
    this.setMarkers(null);
    this.markers = [];

    hotspotsData.forEach(hotspot => {
      let position = {
          lat: parseFloat(hotspot.lat),
          lng: parseFloat(hotspot.lng)
        },
        infoWindowContent = '<div class="infowindow">';

      if (hotspot.name) {
        infoWindowContent += '<h4 class="infowindow__title">' +
          hotspot.name +
        '</h4><hr>';
      }

      if (hotspot.address) {
        infoWindowContent += '<div class="infowindow__address">' +
          '<img src="assets/marker-stroked-24@2x.png"' +
            'class="infowindow__address__image">' +
          '<span class="infowindow__address__text">' +
            hotspot.address +
          '</span>' +
        '</div><hr>';
      }

      if (hotspot.descriptionenglish) {
        infoWindowContent += '<div class="infowindow__description">' +
          hotspot.descriptionenglish +
        '</div><hr>';
      }

      if (hotspot.descriptionforeign) {
        infoWindowContent += '<div class="infowindow__description">' +
          hotspot.descriptionforeign +
        '</div><hr>';
      }

      if (hotspot.openinghours) {
        infoWindowContent += '<div class="infowindow__hours">' +
          '<img src="assets/clock.png" class="infowindow__hours__image">' +
          '<span class="infowindow__hours__text">' +
            hotspot.openinghours +
          '</span>' +
        '</div>';
      }

      infoWindowContent += '</div>';

      this.addMarker({
        latLng: position,
        type: hotspot.type,
        query: hotspot.name + ', ' + hotspot.address,
        infoWindowContent: infoWindowContent
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
