/* global google */

export default class Icons {

  getIconByType(type) {
    let icon = '';
    switch (type) {
    case 'user':
      icon = this.getUserIcon();
      break;
    case 'supermarket':
      icon = this.getSupermarketIcon();
      break;
    case 'culture':
      icon = this.getCultureIcon();
      break;
    default:
      icon = this.getDefaultIcon();
    }

    return icon;
  }

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
