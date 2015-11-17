/* global google */


/**
 * Get the marker icon
 * @param {String} category The category of the location
 * @return {GoogleIconObject} icon The marker icon
 */
/* eslint-disable complexity */
export default function(category) {

  if (category === 'user') {
    return getUserIcon();
  }

  return create(category);

}
/* eslint-enable complexity */

/**
 * Get the user icon
 * @return {GoogleIconObject} icon The marker icon
 */
function getUserIcon() {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: 'blue',
    fillOpacity: 1,
    scale: 3,
    strokeColor: 'white',
    strokeOpacity: 0.5,
    strokeWeight: 2
  }
}

/**
 * Create the google icon object
 * @param {String} category The icon category
 * @return {GoogleIconObject} icon The marker icon
 */
function create(category) {
  let icon = document.querySelector(`#icon-${category}`);
  icon = icon || document.querySelector('#icon-all');

  const path = icon.querySelector('path').getAttribute("d");

  return {
    path: path,
    fillColor: 'white',
    fillOpacity: 1,
    scale: 1,
    strokeWeight: 0
  };
}
