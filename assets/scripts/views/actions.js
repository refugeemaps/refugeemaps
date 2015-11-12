/**
 * The floating actions
 */
export default class {
  /**
   * Initialize
   */
  constructor({
    onMenuToggle = () => {},
    onFiltersToggle = () => {},
    onCenter = () => {}
  }) {
    this.$container = document.querySelector('.actions');
    this.$menuToggle = document.querySelector('.menu-toggle');
    this.$center = this.$container.querySelector('.center');
    this.$filtersToggle = this.$container.querySelector('.filters-toggle');

    this.$center.addEventListener('click', () => onCenter());
    this.$filtersToggle.addEventListener('click', () => onFiltersToggle());
    this.$menuToggle.addEventListener('click', () => onMenuToggle());
  }

  /**
   * Show the actions
   */
  show() {
    this.$container.classList.remove('actions--hidden');
  }
}
