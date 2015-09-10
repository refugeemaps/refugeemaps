/* global google */

export default class Icons {

  /**
   * Get the marker icon
   * @param {String} type The type of the location
   * @return {GoogleIconObject} icon The marker icon
   */
  /* eslint-disable complexity */
  getIconByType(type) {
    switch (type) {
    case 'user':
      return this.getUserIcon();
    case 'mosque':
      return this.getMosqueIcon();
    case 'church':
      return this.getChurchIcon();
    case 'bank':
      return this.getBankIcon();
    case 'call-shop':
      return this.getCallshopIcon();
    case 'supermarket':
      return this.getSupermarketIcon();
    case 'culture':
      return this.getCultureIcon();
    case 'pharmacy':
      return this.getPharmacyIcon();
    case 'laundry':
      return this.getLaundryIcon();
    case 'playground':
      return this.getPlaygroundIcon();
    case 'football':
      return this.getFootballIcon();
    case 'basketball':
      return this.getBasketballIcon();
    case 'table-tennis':
      return this.getTableTennisIcon();
    case 'skateboard':
      return this.getSkateboardIcon();
    case 'library':
      return this.getLibraryIcon();
    case 'public-restroom':
      return this.getRestroomIcon();
    default:
      return this.getDefaultIcon();
    }
  }
  /* eslint-enable complexity */

  /**
   * Get the user icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getUserIcon() {
    let icon = this.create({
      url: '../assets/red-marker.png',
      width: 25,
      height: 40,
      anchorX: 12,
      anchorY: 40
    });
    return icon;
  }

  /**
   * Get the mosque icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getMosqueIcon() {
    let icon = this.create({
      url: '../assets/religious-muslim-24@2x.png',
      width: 30,
      height: 30,
      anchorX: 15,
      anchorY: 15
    });
    return icon;
  }

  /**
   * Get the church icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getChurchIcon() {
    let icon = this.create({
      url: '../assets/religious-christian-24@2x.png',
      width: 30,
      height: 30,
      anchorX: 15,
      anchorY: 15
    });
    return icon;
  }

  /**
   * Get the bank icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getBankIcon() {
    let icon = this.create({
      url: '../assets/bank-24@2x.png',
      width: 30,
      height: 30,
      anchorX: 15,
      anchorY: 15
    });
    return icon;
  }

  /**
   * Get the call-shop icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getCallshopIcon() {
    let icon = this.create({
      url: '../assets/telephone-24@2x.png',
      width: 30,
      height: 30,
      anchorX: 15,
      anchorY: 15
    });
    return icon;
  }

  /**
   * Get the supermarket icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getSupermarketIcon() {
    let icon = this.create({
      url: '../assets/grocery-24@2x.png',
      width: 30,
      height: 30,
      anchorX: 15,
      anchorY: 15
    });
    return icon;
  }

  /**
   * Get the culture icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getCultureIcon() {
    let icon = this.create({
      url: '../assets/town-hall-24@2x.png',
      width: 30,
      height: 30,
      anchorX: 15,
      anchorY: 15
    });
    return icon;
  }

  /**
   * Get the pharmacy icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getPharmacyIcon() {
    let icon = this.create({
      url: '../assets/pharmacy-24@2x.png',
      width: 30,
      height: 30,
      anchorX: 15,
      anchorY: 15
    });
    return icon;
  }

  /**
   * Get the laundry icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getLaundryIcon() {
    let icon = this.create({
      url: '../assets/laundry-24@2x.png',
      width: 30,
      height: 30,
      anchorX: 15,
      anchorY: 15
    });
    return icon;
  }

  /**
   * Get the playground icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getPlaygroundIcon() {
    let icon = this.create({
      url: '../assets/playground-24@2x.png',
      width: 30,
      height: 30,
      anchorX: 15,
      anchorY: 15
    });
    return icon;
  }

  /**
   * Get the football icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getFootballIcon() {
    let icon = this.create({
      url: '../assets/soccer-24@2x.png',
      width: 30,
      height: 30,
      anchorX: 15,
      anchorY: 15
    });
    return icon;
  }

  /**
   * Get the basketball icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getBasketballIcon() {
    let icon = this.create({
      url: '../assets/basketball-24@2x.png',
      width: 30,
      height: 30,
      anchorX: 15,
      anchorY: 15
    });
    return icon;
  }

  /**
   * Get the basketball icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getTableTennisIcon() {
    let icon = this.create({
      url: '../assets/tennis-24@2x.png',
      width: 30,
      height: 30,
      anchorX: 15,
      anchorY: 15
    });
    return icon;
  }

  /**
   * Get the basketball icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getSkateboardIcon() {
    let icon = this.create({
      url: '../assets/skateboard.png',
      width: 30,
      height: 30,
      anchorX: 15,
      anchorY: 15
    });
    return icon;
  }

  /**
   * Get the library icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getLibraryIcon() {
    let icon = this.create({
      url: '../assets/library-24@2x.png',
      width: 30,
      height: 30,
      anchorX: 15,
      anchorY: 15
    });
    return icon;
  }

  /**
   * Get the library icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getRestroomIcon() {
    let icon = this.create({
      url: '../assets/toilets-24@2x.png',
      width: 30,
      height: 30,
      anchorX: 15,
      anchorY: 15
    });
    return icon;
  }

  /**
   * Get the default icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getDefaultIcon() {
    let icon = this.create({
      url: '../assets/marker-24@2x.png',
      width: 30,
      height: 30,
      anchorX: 15,
      anchorY: 15
    });
    return icon;
  }

  /**
   * Create the google icon object
   * @param {String} url The icon URL
   * @param {Integer} width The icon width
   * @param {Integer} height The icon height
   * @param {Integer} anchorX The x anchor value
   * @param {Integer} anchorY The y anchor value
   * @return {GoogleIconObject} icon The marker icon
   */
  create({url, width, height, anchorX, anchorY}) {
    let image = {
      url: url,
      size: new google.maps.Size(width, height),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(anchorX, anchorY),
      scaledSize: new google.maps.Size(width, height)
    };
    return image;
  }
}
