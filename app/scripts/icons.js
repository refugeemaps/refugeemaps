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
      return this.create({url: '../assets/religious-muslim-24@2x.png'});
    case 'church':
      return this.create({url: '../assets/religious-christian-24@2x.png'});
    case 'bank':
      return this.create({url: '../assets/bank-24@2x.png'});
    case 'call-shop':
      return this.create({url: '../assets/telephone-24@2x.png'});
    case 'supermarket':
      return this.create({url: '../assets/grocery-24@2x.png'});
    case 'culture':
      return this.create({url: '../assets/town-hall-24@2x.png'});
    case 'pharmacy':
      return this.create({url: '../assets/pharmacy-24@2x.png'});
    case 'laundry':
      return this.create({url: '../assets/laundry-24@2x.png'});
    case 'playground':
      return this.create({url: '../assets/playground-24@2x.png'});
    case 'football':
      return this.create({url: '../assets/soccer-24@2x.png'});
    case 'basketball':
      return this.create({url: '../assets/basketball-24@2x.png'});
    case 'table-tennis':
      return this.create({url: '../assets/tennis-24@2x.png'});
    case 'skateboard':
      return this.create({url: '../assets/skateboard.png'});
    case 'library':
      return this.create({url: '../assets/library-24@2x.png'});
    case 'public-restroom':
      return this.create({url: '../assets/toilets-24@2x.png'});
    default:
      return this.create({url: '../assets/marker-24@2x.png'});
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
   * Create the google icon object
   * @param {String} url The icon URL
   * @param {Integer} width The icon width
   * @param {Integer} height The icon height
   * @param {Integer} anchorX The x anchor value
   * @param {Integer} anchorY The y anchor value
   * @return {GoogleIconObject} icon The marker icon
   */
  create({url, width = 30, height = 30, anchorX = 15, anchorY = 15}) {
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
