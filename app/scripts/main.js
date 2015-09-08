import Map from './map';

class App {
  /**
   * Constructs the app.
   */
  constructor() {
    this.map = new Map('.map');
    this.map.init();
  }
}

/* eslint-disable no-unused-vars */
let app = new App();
/* eslint-enable no-unused-vars */
