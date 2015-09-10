import Spreadsheet from './spreadsheet.js';

export default class Data {
  constructor() {
    /**
     * The data source.
     */
    this.source = new Spreadsheet();

    this.mandatoryItems = [];
  }

  /**
   * Returns a promise which returns the data from source when resolves.
   * @param {object} options The source options
   * @return {Promise} The promise.
   */
  get({sheet, sourceId}) {
    this.sheet = sheet;

    return new Promise((resolve, reject) => {
      this.source.get(sourceId)
        .then(data => {
          this.buildDataSet(data);
          resolve(this.data[this.sheet].data);
        })
        .catch(reject);
    });
  }

  /**
   * Build the dataset from the spreadsheet.
   * Adds an id and filters not visible data items.
   * @param {object} data The spreadsheet data.
   */
  buildDataSet(data) {
    this.data = data;
    const mandatory = this.data[this.sheet].data.shift();

    for (var row in mandatory) {
      if (mandatory[row]) {
        this.mandatoryItems.push(row);
      }
    }

    this.data[this.sheet].data = this.data[this.sheet].data
      .filter(item => item.visible === 'y' && this.hasMandatories(item))
      .map(item => {
        item.id = item.place + item.lat + item.lng;
        return this.sanitize(item);
      });
  }

  /**
   * Check for mandatory fields.
   * @param {object} item The object to check for mandatory values.
   * @return {boolean} If the mandatory check succeeds or fails.
   */
  hasMandatories(item) {
    var containsMandatories = true,
      key = '';

    for (key in item) {
      if (this.mandatoryItems.indexOf(key) >= 0) {
        if (item[key] === null || item[key] === '') {
          containsMandatories = false;
        }
      }
    }

    return containsMandatories;
  }

  /**
   * Returns a sanitized item object.
   * @param {object} item The item to sanitize.
   * @return {object} The sanitized item.
   */
  sanitize(item) {
    for (var key in item) {
      if (item.hasOwnProperty(key)) {
        item[key] = item[key].trim();
      }
    }

    return item;
  }
}
