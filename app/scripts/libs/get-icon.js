/* global google */

const icons = {
  mosque: 'mosque',
  church: 'curch',
  bank: 'bank',
  'call-shop': 'call-shop',
  supermarket: 'supermarket',
  culture: 'culture',
  pharmacy: 'pharmacy',
  laundry: 'laundry',
  playground: 'playground',
  football: 'football',
  basketball: 'basketball',
  'table-tennis': 'table-tennis',
  skateboard: 'skateboard',
  library: 'library',
  'public-restroom': 'public-restroom'
};

/**
 * Get the marker icon
 * @param {String} category The category of the location
 * @return {GoogleIconObject} icon The marker icon
 */
/* eslint-disable complexity */
export default function(category) {
  const iconName = icons[category];

  if (iconName) {
    return create({url: `assets/${iconName}.png`});
  }

  if (category === 'user') {
    return getUserIcon();
  }

  return create({url: 'assets/marker-24@2x.png'});
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
