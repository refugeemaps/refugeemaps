import isRightToLeft from '../libs/is-right-to-left';

/**
 * The category filters
 */
export default class {
  /**
   * Initialize
   */
  constructor({
    onFilterChange = () => {}
  }) {
    this.$container = document.querySelector('.filters');
    this.$body = this.$container.querySelector('.filters__body');
    this.$header = this.$container.querySelector('.filters__header');

    this.currentFilter = null;
    this.onFilterChange = onFilterChange;

    this.$header.addEventListener('click', () => this.toggle());
  }

  /**
   * Add filter items for each category to filter list
   * @param {Object} categories The items data object
   */
  renderCategories(categories) {
    categories.forEach(category => {
      let $categoryFilter = document.createElement('div'),
        $categoryFilterIcon = document.createElement('img'),
        $categoryFilterText = document.createElement('span');

      $categoryFilter.className = 'filters__body__filter';
      $categoryFilter.addEventListener('click',
        () => this.toggleCategoryFilter($categoryFilter, category.key));

      $categoryFilterIcon.src = `static/images/${category.key}.png`;
      $categoryFilterIcon.className = 'filters__body__filter__image';

      $categoryFilterText.textContent = category.english;
      $categoryFilterText.className = 'filters__body__filter__text';

      $categoryFilter.appendChild($categoryFilterIcon);
      $categoryFilter.appendChild($categoryFilterText);
      this.$body.appendChild($categoryFilter);
    });

    this.categories = categories;
    this.$categoryFilters =
      this.$body.querySelectorAll('.filters__body__filter');
  }

  /**
   * Update the language
   * @param {String} language The new language
   */
  changeLanguage(language) {
    if (isRightToLeft(language)) {
      this.$container.classList.add('filters--rtl');
    } else {
      this.$container.classList.remove('filters--rtl');
    }

    for (let i = 0; i < this.$categoryFilters.length; i++) {
      this.$categoryFilters[i].lastChild.textContent =
        this.categories[i][language];
    }
  }

  /**
   * Filter the hotspot data
   * @param {DOMNode} $categoryFilter The filter item
   * @param {String} categoryKey The type of the filter
   */
  toggleCategoryFilter($categoryFilter, categoryKey) {
    let isAlreadyActive = this.currentFilter === categoryKey;

    for (let i = 0; i < this.$categoryFilters.length; i++) {
      this.$categoryFilters[i].classList
        .remove('filters__body__filter--active');
    }

    if (isAlreadyActive) {
      this.currentFilter = null;
    } else {
      this.currentFilter = categoryKey;
      $categoryFilter.classList.add('filters__body__filter--active');
    }

    this.onFilterChange(this.currentFilter);
    this.toggle();
  }

  /**
   * Toggle the filters visibility
   */
  toggle() {
    this.$container.classList.toggle('filters--hidden');
  }
}
