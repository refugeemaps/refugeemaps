import Promise from 'lie';
import reqwest from 'reqwest';
import config from '../config/config';

/**
 * Returns a promise which resolves the pois data
 * @return {Promise} The promise.
 */
export default function() {
  const url = config.poisApiUrl.replace('{{location}}', window.locationId);

  return new Promise((resolve, reject) => {
    reqwest({
      url: url,
      method: 'GET',
      success: resolve,
      error: reject
    });
  });
}
