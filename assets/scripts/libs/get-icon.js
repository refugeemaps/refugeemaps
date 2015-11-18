import config from '../config/config';

/**
 * Get the marker icon
 * @param {String} category The category of the location
 * @return {GoogleIconObject} icon The marker icon
 */

export default function(category) {
  if (category === 'user') {
    return config.userIcon;
  }

  return create(category);
}

/**
 * Create the google icon object
 * @param {String} category The icon category
 * @return {GoogleIconObject} icon The marker icon
 */
function create(category) {
  let icon = document.querySelector(`#icon-${category}`);
  icon = icon || document.querySelector('#icon-all');

  const path = icon.querySelector('path').getAttribute('d');

  return {
    path: path,
    fillColor: 'white',
    fillOpacity: 1,
    scale: 1,
    strokeWeight: 0
  };
}
