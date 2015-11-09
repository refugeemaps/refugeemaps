import config from './config';
import getData from './get-data';
import isRightToLeft from './is-right-to-left';

export default class Sidebar {
  /**
   * Constructs the Sidebar
   * @param {google.maps.Map} map The map
   * @param {String} selector The sidebar container selector
   * @param {Object} hotspotsData The hotspot data
   */
  constructor(map, selector, hotspotsData) {
    this.map = map;
    this.hotspotsData = hotspotsData;
    this.currentFilter = [];
    this.selector = selector;
    this.$container = document.querySelector(selector);
    this.$languageSwitcher = document.querySelector('.language-filter');
    this.$itemsWrapper = this.$container.querySelector(`${selector}__body`);
    this.$items = this.$container.querySelectorAll(`${selector}__body__filter`);
    this.$header = this.$container.querySelector(`${selector}__header`);
    this.$headerShow = this.$container
      .querySelector(`${selector}__header__show`);
    this.$headerHide = this.$container
      .querySelector(`${selector}__header__hide`);

    getData({spreadsheetId: config.categoriesSpreadsheetId})
      .then(categories => {
        this.categoriesFilterData = categories;
        this.renderCategories(categories);
      });
  }

  /**
   * Add filter items for each category to sidebar
   * @param {Object} categories The items data object
   */
  renderCategories(categories) {
    categories.forEach(category => {
      let categorieFilter = document.createElement('div'),
        categorieFilterIcon = document.createElement('img'),
        categorieFilterText = document.createElement('span');

      categorieFilter.className = 'sidebar__filters__body__filter';
      categorieFilter.setAttribute('data-filter', category.key);

      categorieFilterIcon.src = `assets/${category.key}.png`;
      categorieFilterIcon.className = 'sidebar__filters__body__filter__image';

      categorieFilterText.textContent = category.english;
      categorieFilterText.className = 'sidebar__filters__body__filter__text';

      categorieFilter.appendChild(categorieFilterIcon);
      categorieFilter.appendChild(categorieFilterText);
      this.$itemsWrapper.appendChild(categorieFilter);
    });

    this.initEvents(this.selector);
  }

  /**
   * Add click listener to sidebar items
   * @param {String} selector The container selector
   */
  initEvents(selector) {
    this.$items = this.$container.querySelectorAll(`${selector}__body__filter`);
    for (let i = 0; i < this.$items.length; i++) {
      let type = this.$items[i].getAttribute('data-filter');
      this.$items[i].addEventListener('click',
        () => this.filterMarker(this.hotspotsData, this.$items[i], type));
    }

    this.$header.addEventListener('click', () => this.toggleSidebar());

    this.$languageSwitcher.addEventListener('change', event =>
      this.switchLanguage(event, this.$items));
  }

  /**
   * Add filter items to sidebar
   * @param {ChangeEvent} event The change event of the radio buttons
   * @param {DOMNodes} $items The filter items
   */
  switchLanguage(event, $items) {
    let language = event.target.value;

    if (isRightToLeft(language)) {
      this.$container.classList.add('sidebar__filters--rtl');
    } else {
      this.$container.classList.remove('sidebar__filters--rtl');
    }

    for (let i = 0; i < $items.length; i++) {
      $items[i].lastChild.textContent = this.categoriesFilterData[i][language];
    }
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
