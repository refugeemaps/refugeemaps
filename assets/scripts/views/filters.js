import Sidebar from './sidebar';
import isRightToLeft from '../libs/is-right-to-left';

/**
 * The category filters
 */
export default class extends Sidebar {
  /**
   * Initialize
   */
  constructor({
    onFilterChange = () => {}
  }) {
    super('.filters');

    this.$back = this.$container
      .querySelector('.filters__content__header__back');
    this.$filterSelect = this.$container.querySelector('.filter-select');
    this.$filterSelectBody = this.$container
      .querySelector('.filter-select__body');

    this.$back.addEventListener('click', () => this.hide());
    this.$filterSelect
      .addEventListener('change', this.switchCategory.bind(this));

    this.onFilterChange = onFilterChange;
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
    this.$categoryFilters = this.$filterSelectBody
      .querySelectorAll('.select-list__item');
  }

  /**
   * Render one category
   * @param  {Object} category The category to render
   */
  renderCategory(category) {
    const $categoryFilter = document.createElement('li'),
      $categoryFilterInput = document.createElement('input'),
      $categoryFilterLabel = document.createElement('label'),
      $categoryFilterLabelIcon = document.createElement('img'),
      $categoryFilterLabelText = document.createElement('span'),
      isAllFilter = category.key === 'all';

    $categoryFilterInput.name = 'category';
    $categoryFilterInput.id = category.key;
    $categoryFilterInput.setAttribute('value', category.key);
    $categoryFilterInput.setAttribute('type', 'radio');
    if (isAllFilter) {
      $categoryFilterInput.setAttribute('checked', 'checked');
    }

    $categoryFilterLabel.className =
      'select-list__item select-list__item--with-image';
    $categoryFilterLabel.setAttribute('for', category.key);

    $categoryFilterLabelIcon.src = `static/images/${category.key}.png`;
    $categoryFilterLabelIcon.className = 'select-list__item__image';

    $categoryFilterLabelText.textContent = category.english;
    $categoryFilterLabelText.className = 'select-list__item__text';

    $categoryFilterLabel.appendChild($categoryFilterLabelIcon);
    $categoryFilterLabel.appendChild($categoryFilterLabelText);
    $categoryFilter.appendChild($categoryFilterInput);
    $categoryFilter.appendChild($categoryFilterLabel);
    this.$filterSelectBody.appendChild($categoryFilter);
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
   * Switch the category
   * @param {ChangeEvent} event The change event of the radio buttons
   */
  switchCategory(event) {
    let category = event.target.value;
    this.onFilterChange(category);
    this.hide();
  }
}
