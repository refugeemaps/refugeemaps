/**
 * Find the closest city/spreadsheet to the user location.
 * Using the Haversine formula to calc distance between locations.
 * @param {Object} cities The cities object
 * @param {Object} userPos The user position
 * @return {Promise} Promise with the closest city
 */
export default function(cities, userPos) {
  let userLat = userPos.lat,
    userLng = userPos.lng,
    r = 6371, // radius of earth in km
    distances = [],
    closestIndex = -1,
    closestCity = '';

  cities.forEach((city, index) => {
    let cityLat = city.lat,
      cityLng = city.lng,
      dLat = rad(cityLat - userLat),
      dLong = rad(cityLng - userLng),
      a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(userLat)) * Math.cos(rad(userLat))
        * Math.sin(dLong / 2) * Math.sin(dLong / 2),
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
      d = r * c;

    distances[index] = d;

    if (closestIndex === -1 || d < distances[closestIndex]) {
      closestIndex = index;
      closestCity = city;
    }
  });

  return closestCity;
}

/**
 * Convert from degrees to radians
 * @param {Float} x The degrees value
 * @return {Float} The radian value
 */
function rad(x) {
  return x * Math.PI / 180;
}
