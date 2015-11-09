import reqwest from 'reqwest';
import config from './config';

/**
 * Trigger method to get the spreadsheet data.
 * @param {string} key The spreadsheet key.
 * @return {Promise} A promise resolving after all data is fetched.
 */
export default function(key) {
  const url = `${config.spreadsheetBaseUrl}feeds/worksheets/${key}/public/` +
      'basic?alt=json';

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(data => getSheets(key, data))
      .then(sheets => resolve(sheets))
      .catch(reject);
  });
}

/**
 * Fetches a given url.
 * @param {string} url The url to fetch
 * @return {Promise} The promise.
 */
function fetch(url) {
  return new Promise((resolve, reject) => {
    reqwest({
      url: url,
      method: 'GET',
      crossOrigin: true,
      success: resolve,
      error: reject
    });
  });
}

/**
 * Builds the sheet urls to fetch.
 * @param {string} key The spreadsheet key.
 * @param {object} sheetsData The data of the whole worksheet.
 * @return {Promise} The promise.
 */
function getSheets(key, sheetsData) {
  return new Promise((resolve, reject) => {
    const sheetRequests = [];

    sheetsData.feed.entry.forEach(item => {
      const id = item.id.$t.split('/').pop(),
        url = `${config.spreadsheetBaseUrl}feeds/list/${key}/${id}/public/` +
          'values?alt=json';

      sheetRequests.push(
        fetch(url)
          .then(data => parse(data, id))
          .catch(err => console.error(err))); // eslint-disable-line no-console
    });

    Promise.all(sheetRequests)
      .then(resolve)
      .catch(reject);
  });
}

/**
 * Parses one special sheetdata.
 * @param {object} data The sheet data.
 * @param {string} id   The sheet id.
 * @return {Object} The sheet
 */
function parse(data, id) {
  const sheet = {
    id: id,
    title: data.feed.title.$t,
    data: []
  };

  data.feed.entry.forEach(item => {
    const itemData = {};

    for (var key in item) {
      if (/^gsx/.test(key)) {
        itemData[key.replace(/^gsx\$/, '')] = item[key].$t;
      }
    }

    sheet.data.push(itemData);
  });

  return sheet;
}
