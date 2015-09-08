/* global google */

export default class Map {
  /**
   * Constructs the map
   */
  constructor() {
    this.container = document.querySelector('.map');
    this.options = {
      center: {
        lat: 53.560022,
        lng: 9.977840
      },
      zoom: 14
    };
  }

  /**
   * Init google map
   */
  init() {
    this.map = new google.maps.Map(this.container, this.options);
  }
}
