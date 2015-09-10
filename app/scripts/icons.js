/* global google */

export default class Icons {

  /**
   * Get the marker icon
   * @param {String} type The type of the location
   * @return {GoogleIconObject} icon The marker icon
   */
  getIconByType(type) {
    switch (type) {
    case 'user':
      return this.getUserIcon();
    case 'supermarket':
      return this.getSupermarketIcon();
    case 'culture':
      return this.getCultureIcon();
    default:
      return this.getDefaultIcon();
    }
  }

  /**
   * Get the user icon
   * @return {GoogleIconObject} icon The marker icon
   */
  getUserIcon() {
    let icon = this.create({
      url: '../assets/marker-stroked-24@2x.png',
      width: 40,
      height: 40,
      anchorX: 20,
      anchorY: 40
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
