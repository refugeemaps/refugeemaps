/* global google */

/**
 * Get the marker icon
 * @param {String} type The type of the location
 * @return {GoogleIconObject} icon The marker icon
 */
/* eslint-disable complexity */
export default function(type) {
  switch (type) {
    case 'user':
      return getUserIcon();
    case 'mosque':
      return create({url: 'assets/religious-muslim-24@2x.png'});
    case 'church':
      return create({url: 'assets/religious-christian-24@2x.png'});
    case 'bank':
      return create({url: 'assets/bank-24@2x.png'});
    case 'call-shop':
      return create({url: 'assets/telephone-24@2x.png'});
    case 'supermarket':
      return create({url: 'assets/grocery-24@2x.png'});
    case 'culture':
      return create({url: 'assets/town-hall-24@2x.png'});
    case 'pharmacy':
      return create({url: 'assets/pharmacy-24@2x.png'});
    case 'laundry':
      return create({url: 'assets/laundry-24@2x.png'});
    case 'playground':
      return create({url: 'assets/playground-24@2x.png'});
    case 'football':
      return create({url: 'assets/soccer-24@2x.png'});
    case 'basketball':
      return create({url: 'assets/basketball-24@2x.png'});
    case 'table-tennis':
      return create({url: 'assets/tennis-24@2x.png'});
    case 'skateboard':
      return create({url: 'assets/skateboard.png'});
    case 'library':
      return create({url: 'assets/library-24@2x.png'});
    case 'public-restroom':
      return create({url: 'assets/toilets-24@2x.png'});
    default:
      return create({url: 'assets/marker-24@2x.png'});
  }
}
/* eslint-enable complexity */

/**
 * Get the user icon
 * @return {GoogleIconObject} icon The marker icon
 */
function getUserIcon() {
  return create({
    url: 'assets/red-marker.png',
    width: 25,
    height: 40,
    anchorX: 12,
    anchorY: 40
  });
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
function create({url, width = 30, height = 30, anchorX = 15, anchorY = 15}) {
  return {
    url: url,
    size: new google.maps.Size(width, height),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(anchorX, anchorY),
    scaledSize: new google.maps.Size(width, height)
  };
}
