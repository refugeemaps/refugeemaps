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
    this.$categoryFilters = this.$container
      .querySelectorAll('.select-list__item');

    this.$back.addEventListener('click', () => this.hide());
    this.$filterSelect
      .addEventListener('change', this.switchCategory.bind(this));

    this.onFilterChange = onFilterChange;
  }

  /**
   * Update the language
   * @param {String} language The new language
   */
  changeLanguage(language) {
    if (isRightToLeft(language)) {
      this.$filterSelect.classList.add('select-list--rtl');
    } else {
      this.$filterSelect.classList.remove('select-list--rtl');
    }

    for (let i = 0; i < this.$categoryFilters.length; i++) {
      const $categoryFilter = this.$categoryFilters[i],
        $categoryFilterText = $categoryFilter
          .querySelector('.select-list__item__text'),
        text = $categoryFilter.getAttribute(`data-${language}`);

      $categoryFilterText.textContent = text;
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
