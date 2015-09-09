import reqwest from 'reqwest';

export default class Spreadsheet {
  /**
   * Initialize
   */
  constructor() {
    /**
     * The spreadsheet key.
     * @type {string}
     */
    this.key = '';

    /**
     * The google spreadsheets baseUrl.
     * @type {string}
     */
    this.baseUrl = 'https://spreadsheets.google.com/';

    /**
     * The sheets data
     * @type {Object}
     */
    this.sheets = {};
  }

  /**
   * Trigger method to get the spreadsheet data.
   * @param {string} key The spreadsheet key.
   * @return {Promise} A promise resolving after all data is fetched.
   */
  get(key) {
    this.key = key;

    return new Promise((resolve, reject) => {
      this.fetch(this.baseUrl + 'feeds/worksheets/' +
          this.key + '/public/basic?alt=json')
        .then(data => this.getSheets(data))
        .then(() => resolve(this.sheets))
        .catch(reject);
    });
  }

  /**
   * Fetches a given url.
   * @param {string} url The url to fetch
   * @return {Promise} The promise.
   */
  fetch(url) {
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
   * @param {object} sheetsData The data of the whole worksheet.
   * @return {Promise} The promise.
   */
  getSheets(sheetsData) {
    return new Promise((resolve, reject) => {
      let sheetRequests = [];

      sheetsData.feed.entry.forEach(item => {
        let id = item.id.$t.split('/').pop(),
          url = this.baseUrl + '/feeds/list/' + this.key +
          '/' + id + '/public/values?alt=json';

        sheetRequests.push(
          this.fetch(url)
          .then(data => this.parse(data, id))
          /* eslint-disable no-console */
          .catch(err => console.log(err)));
          /* eslint-enable no-console */
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
   */
  parse(data, id) {
    let sheet = {
      id: id,
      title: data.feed.title.$t,
      data: []
    };

    data.feed.entry.forEach(item => {
      let itemData = {};

      for (var key in item) {
        if (/^gsx/.test(key)) {
          itemData[key.replace(/^gsx\$/, '')] = item[key].$t;
        }
      }

      sheet.data.push(itemData);
    });
    this.sheets[id] = sheet;
  }
}
