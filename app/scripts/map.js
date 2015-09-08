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
    this.map = new google.maps.Map(this.$container, this.options);
  }
}
