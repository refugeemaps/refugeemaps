/**
 * The floating actions
 */
export default class {
  /**
   * Initialize
   */
  constructor({
    onFiltersToggle = () => {},
    onCenter = () => {}
  }) {
    this.$container = document.querySelector('.actions');
    this.$center = this.$container.querySelector('.center');
    this.$filtersToggle = this.$container.querySelector('.filters-toggle');

    this.$center.addEventListener('click', () => onCenter());
    this.$filtersToggle.addEventListener('click', () => onFiltersToggle());
  }

  /**
   * Show the actions
   */
  show() {
    this.$container.classList.remove('actions--hidden');
  }
}
