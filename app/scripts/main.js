import Map from './map';

class App {
  /**
   * Constructs the app.
   */
  constructor() {
    this.map = new Map();
  }

  /**
   * Init main app
   */
  init() {
    this.map.init();
  }
}

let app = new App();
app.init();
