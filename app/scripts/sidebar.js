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
    this.$itemsWrapper = document.querySelector(`${selector}__items`);
    this.$items = document.querySelectorAll(`${selector}__items__item`);
    this.$header = document.querySelector(`${selector}__header`);
    this.$headerShow = document.querySelector(`${selector}__header__show`);
    this.$headerHide = document.querySelector(`${selector}__header__hide`);
    this.initEvents();
  }

  /**
   * Add click listener to sidebar items
   */
  initEvents() {
    for (let i = 0; i < this.$items.length; i++) {
      let type = this.$items[i].dataset.filter;
      this.$items[i].addEventListener('click',
        () => this.filterMarker(this.hotspotsData, this.$items[i], type));
    }

    this.$header.addEventListener('click', () => this.toggleSidebar());
  }

  /**
   * Filter the hotspot data
   * @param {Object} hotspotsData The hotspot data
   * @param {DOMNode} item The sidebar item
   * @param {String} type The type of the filter
   */
  filterMarker(hotspotsData, item, type) {
    let filteredData = [];

    item.classList.toggle('sidebar__keys__items__item--active');

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
    this.$itemsWrapper.classList.toggle('sidebar__keys__items--hidden');
    this.$header.classList.toggle('sidebar__keys__header--hide-filters');
  }
}
