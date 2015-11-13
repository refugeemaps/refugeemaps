/**
 * The sidebar. Can be extended
 */
export default class {
  /**
   * Initialize
   * @param {String} selector The sidebar container selector
   */
  constructor(selector) {
    this.$container = document.querySelector(selector);
    this.$obfuscator = this.$container.querySelector('.sidebar__obfuscator');

    this.$obfuscator.addEventListener('click', this.hide.bind(this));
  }

  /**
   * Toggle the sidebar visibility
   */
  toggle() {
    this.$container.classList.toggle('sidebar--hidden');
  }

  /**
   * Hide the sidebar
   */
  hide() {
    this.$container.classList.add('sidebar--hidden');
  }
}
