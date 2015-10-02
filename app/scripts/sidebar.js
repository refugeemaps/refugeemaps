import Data from './data';

export default class Sidebar {
  /**
   * Constructs the Sidebar
   * @param {GoogleMap} map The map
   * @param {String} selector The sidebar container selector
   * @param {Object} hotspotsData The hotspot data
   */
  constructor(map, selector, hotspotsData) {
    this.map = map;
    this.hotspotsData = hotspotsData;
    this.currentFilter = [];
    this.selector = selector;
    this.$container = document.querySelector(selector);
    this.$languageSwitcher =
      document.querySelector('.language-filter');
    this.$itemsWrapper = document.querySelector(`${selector}__body`);
    this.$items = document.querySelectorAll(`${selector}__body__filter`);
    this.$header = document.querySelector(`${selector}__header`);
    this.$headerShow = document.querySelector(`${selector}__header__show`);
    this.$headerHide = document.querySelector(`${selector}__header__hide`);

    this.getItems('1TSg1Nd9j-zqNw-HaxAR__jyOU3GLtI_eW3oEddvEu-Y')
      .then(items => {
        this.filterItemsData = items;
        this.addToSidebar(items);
      });
  }

  /**
   * Add click listener to sidebar items
   * @param {String} selector The container selector
   */
  initEvents(selector) {
    this.$items = document.querySelectorAll(`${selector}__body__filter`);
    for (let i = 0; i < this.$items.length; i++) {
      let type = this.$items[i].dataset.filter;
      this.$items[i].addEventListener('click',
        () => this.filterMarker(this.hotspotsData, this.$items[i], type));
    }

    this.$header.addEventListener('click', () => this.toggleSidebar());
    this.$languageSwitcher.addEventListener('change', event =>
      this.switchLanguage(event, this.$items));
  }

  /**
   * Add filter items to sidebar
   * @param {Object} items The items data object
   */
  addToSidebar(items) {
    items.forEach(item => {
      let filterItem = document.createElement('div'),
        filterItemIcon = document.createElement('img'),
        filterItemText = document.createElement('span');

      filterItem.className = 'sidebar__filters__body__filter';
      filterItem.dataset.filter = item.key;

      filterItemIcon.src = `assets/${item.key}.png`;
      filterItemIcon.className = 'sidebar__filters__body__filter__image';

      filterItemText.textContent = item.english;
      filterItemText.className = 'sidebar__filters__body__filter__text';

      filterItem.appendChild(filterItemIcon);
      filterItem.appendChild(filterItemText);
      this.$itemsWrapper.appendChild(filterItem);
    });

    this.initEvents(this.selector);
  }

  /**
   * Add filter items to sidebar
   * @param {ChangeEvent} event The change event of the radio buttons
   * @param {DOMNodes} items The filter items
   */
  switchLanguage(event, items) {
    let language = event.target.value;

    for (let i = 0; i < this.$items.length; i++) {
      items[i].lastChild.textContent = this.filterItemsData[i][language];
    }
  }

  /**
   * Get the sidebar filter items
   * @param {String} spreadsheetId The spreadsheet id
   * @return {Promise} The promise with the filter items object
   */
  getItems(spreadsheetId) {
    this.filterItems = new Data();

    return this.filterItems.get({
      sourceId: spreadsheetId,
      sheet: 'od6'
    });
  }

  /**
   * Filter the hotspot data
   * @param {Object} hotspotsData The hotspot data
   * @param {DOMNode} item The sidebar item
   * @param {String} type The type of the filter
   */
  filterMarker(hotspotsData, item, type) {
    let filteredData = [];

    item.classList.toggle('sidebar__filters__body__filter--active');

    this.updateCurrentFilter(type);

    this.currentFilter.forEach(filter => {
      hotspotsData.forEach(hotspot => {
        if (hotspot.type === filter) {
          filteredData.push(hotspot);
        }
      });
    });

    if (filteredData.length > 0) {
      this.map.addHotspots(filteredData);
    } else {
      this.map.addHotspots(hotspotsData);
    }
  }

  /**
   * Update the current filter selection
   * @param {String} type The hotspot data
   */
  updateCurrentFilter(type) {
    let index = this.currentFilter.indexOf(type);

    if (index === -1) {
      this.currentFilter.push(type);
    } else {
      this.currentFilter.splice(index, 1);
    }
  }

  /**
   * Toggle the sidebar visibility
   */
  toggleSidebar() {
    this.$itemsWrapper.classList.toggle('sidebar__filters__body--hidden');
    this.$header.classList.toggle('sidebar__filters__header--hide-filters');
  }
}
