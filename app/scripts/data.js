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
  get({
    sheet, sourceId
  }) {
    this.sheet = sheet;

    return new Promise((resolve, reject) => {
      this.source.get(sourceId)
        .then(data => {
          this.buildDataSet(data);
          resolve();
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

  /**
   * Returns all hotspots.
   * @return {Array} The hotspot list.
   */
  getHotspots() {
    return this.data[this.sheet].data;
  }

  /**
   * Returns the hotspot ids for all hotspots.
   * @return {Array.string} The hotspot ids
   */
  getHotspotIds() {
    const data = this.data[this.sheet].data;

    return this.getIds(data);
  }

  /**
   * Returns all hotspot ids for a given tag.
   * @param {string} tag the tag to filter the hotspot list by.
   * @return {Array.string} The id list
   */
  getHotspotIdsByTag(tag) {
    const data = this.data[this.sheet].data;

    return this.getIds(data.filter(item => item.tags.match(tag)));
  }

  /**
   * Returns the ids from given hotspot list.
   * @param {Array} hotspots The hotspot list to reduce.
   * @return {Array} The list of ids.
   */
  getIds(hotspots) {
    return hotspots.reduce((ids, hotspot) => {
      ids.push(hotspot.id);
      return ids;
    }, []);
  }

  /**
   * Returns all tags from the hotspots.
   * @return {Array.string} The tags.
   */
  getTags() {
    const tagList = this.getHotspots().reduce((tags, hotspot) => {
      hotspot.tags.split(',').forEach(tag => {
        tag = tag.trim();

        if (tags.indexOf(tag) === -1 && tag !== '') {
          tags.push(tag);
        }
      });

      return tags;
    }, []);

    return tagList;
  }
}
