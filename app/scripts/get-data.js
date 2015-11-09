import Promise from 'lie';
import find from 'array-find';
import getSpreadsheet from './get-spreadsheet.js';

/**
 * Returns a promise which returns the data from source when resolves.
 * @param {Object} options The source options
 * @return {Promise} The promise.
 */
export default function({sheet, sourceId}) {
  return new Promise((resolve, reject) => {
    getSpreadsheet(sourceId)
      .then(data => getSpreadsheetData(data, sheet))
      .then(spreadsheetData => buildDataSet(spreadsheetData))
      .then(spreadsheetData => resolve(spreadsheetData))
      .catch(reject);
  });
}

/**
 * Get the data from a spreadsheet
 * @param {Object} data The spreadsheet data.
 * @param {String} sheetId The sheet to get.
 * @return {Object} The spreadsheet data.
 */
function getSpreadsheetData(data, sheetId) {
  const sheet = find(data, item => item.id === sheetId);
  return sheet.data;
}

/**
 * Build the dataset from the spreadsheet.
 * Adds an id and filters not visible data items.
 * @param {Object} data The spreadsheet data.
 * @return {Object} The improved spreadsheet data.
 */
function buildDataSet(data) {
  const mandatory = data.shift(),
    mandatoryItems = [];

  for (var row in mandatory) {
    if (mandatory[row]) {
      mandatoryItems.push(row);
    }
  }

  return data
    .filter(item => {
      return item.visible === 'y' &&
        hasMandatories(item, mandatoryItems);
    })
    .map(item => sanitize(item));
}

/**
 * Check for mandatory fields.
 * @param {Object} item The object to check for mandatory values.
 * @param {Array} mandatoryItems The mandatory items.
 * @return {Boolean} If the mandatory check succeeds or fails.
 */
function hasMandatories(item, mandatoryItems) {
  let containsMandatories = true,
    key = '';

  for (key in item) {
    if (mandatoryItems.indexOf(key) >= 0) {
      if (item[key] === null || item[key] === '') {
        containsMandatories = false;
      }
    }
  }

  return containsMandatories;
}

/**
 * Returns a sanitized item object.
 * @param {Object} item The item to sanitize.
 * @return {Object} The sanitized item.
 */
function sanitize(item) {
  for (let key in item) {
    if (item.hasOwnProperty(key)) {
      item[key] = item[key].trim();
    }
  }

  return item;
}
