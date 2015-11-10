/**
 * The sidebar
 */
export default class {
  /**
   * Initialize
   */
  constructor() {
    this.$container = document.querySelector('.sidebar');
  }

  /**
   * Show the sidebar
   */
  show() {
    this.$container.classList.remove('sidebar--hidden');
  }
}
