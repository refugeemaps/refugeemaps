/**
 * The language switch
 */
export default class {
  /**
   * Initialize
   */
  constructor({
    onLanguageChange = () => {}
  }) {
    this.$container = document.querySelector('.menu');
    this.$languageSelect = this.$container.querySelector('.language-select');

    this.$languageSelect
      .addEventListener('change', this.switchLanguage.bind(this));

    this.onLanguageChange = onLanguageChange;
  }

  /**
   * Switch the language
   * @param {ChangeEvent} event The change event of the radio buttons
   */
  switchLanguage(event) {
    let language = event.target.value;
    this.onLanguageChange(language);
    this.hide();
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
