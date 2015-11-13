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
    this.$back = this.$container
      .querySelector('.filters__content__header__back');
    this.$body = this.$container.querySelector('.filters__content__body');

    this.currentFilter = 'all';
    this.onFilterChange = onFilterChange;

    this.$back.addEventListener('click', () => this.hide());
  }

  /**
   * Add filter items for each category to filter list
   * @param {Object} categories The items data object
   */
  renderCategories(categories) {
    categories.unshift({
      key: 'all',
      visible: 'y',
      english: 'All categories',
      german: 'Alle Kategorien',
      arabic: 'جميع الفئات'
    });

    categories.forEach(this.renderCategory.bind(this));

    this.categories = categories;
    this.$categoryFilters =
      this.$body.querySelectorAll('.filter');
  }

  /**
   * Render one category
   * @param  {Object} category The category to render
   */
  renderCategory(category) {
    const $categoryFilter = document.createElement('div'),
      $categoryFilterIcon = document.createElement('img'),
      $categoryFilterText = document.createElement('span'),
      isAllFilter = category.key === 'all';

    $categoryFilter.className = isAllFilter ?
      'filter filter--active' :
      'filter';
    $categoryFilter.addEventListener('click',
      () => this.toggleCategoryFilter($categoryFilter, category.key));

    $categoryFilterIcon.src = `static/images/${category.key}.png`;
    $categoryFilterIcon.className = 'filter__image';

    $categoryFilterText.textContent = category.english;
    $categoryFilterText.className = 'filter__text';

    $categoryFilter.appendChild($categoryFilterIcon);
    $categoryFilter.appendChild($categoryFilterText);
    this.$body.appendChild($categoryFilter);

    if (isAllFilter) {
      this.$allFilter = $categoryFilter;
    }
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
        .remove('filter--active');
    }

    if (isAlreadyActive) {
      this.currentFilter = 'all';
      this.$allFilter.classList.add('filter--active');
    } else {
      this.currentFilter = categoryKey;
      $categoryFilter.classList.add('filter--active');
    }

    this.onFilterChange(this.currentFilter);
    this.toggle();
  }

  /**
   * Toggle the filters visibility
   */
  toggle() {
    this.$container.classList.toggle('sidebar--hidden');
  }

  /**
   * Hide the filters
   */
  hide() {
    this.$container.classList.add('sidebar--hidden');
  }
}
