export default class Sidebar {
  /**
   * Constructs the Sidebar
   * @param {GoogleMap} map The map
   * @param {String} itemSelector The sidebar item selector
   * @param {Object} hotspotsData The hotspot data
   */
  constructor(map, itemSelector, hotspotsData) {
    this.map = map;
    this.hotspotsData = hotspotsData;
    this.currentFilter = [];

    this.$itemsContainer = document.querySelector('.sidebar__keys__items');
    this.$items = document.querySelectorAll(itemSelector);
    this.$sidebarHeader = document.querySelector('.sidebar__keys__header');
    this.sidebarHeaderTextShow = this.$sidebarHeader.dataset.show;
    this.sidebarHeaderTextHide = this.$sidebarHeader.dataset.hide;
    this.initEvents();
  }

  /**
   * Add click listener to sidebar items
   */
  initEvents() {
    /* eslint-disable id-length  */
    for (let i = 0; i < this.$items.length; i++) {
      let type = this.$items[i].dataset.filter;
      this.$items[i].addEventListener('click',
        () => this.filterMarker(this.hotspotsData, this.$items[i], type));
    }
    /* eslint-enable id-length  */

    this.$sidebarHeader.addEventListener('click', () => this.toggleSidebar());
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
    this.$itemsContainer.classList.toggle('sidebar__keys__items--hidden');

    if (this.$sidebarHeader.textContent === this.sidebarHeaderTextHide) {
      this.$sidebarHeader.textContent = this.sidebarHeaderTextShow;
    } else {
      this.$sidebarHeader.textContent = this.sidebarHeaderTextHide;
    }
  }
}
