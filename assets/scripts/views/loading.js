/**
 * The loading indicator
 */
export default class {
  /**
   * Initialize
   */
  constructor() {
    this.$container = document.querySelector('.loading');
  }

  /**
   * Hide the loading indicator
   */
  hide() {
    this.$container.classList.add('overlay--hidden');
  }
}
