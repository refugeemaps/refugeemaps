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
    this.$container = document.querySelector('.language-switch');
    this.$container.addEventListener('change', this.switchLanguage.bind(this));
    this.onLanguageChange = onLanguageChange;
  }

  /**
   * Switch the language
   * @param {ChangeEvent} event The change event of the radio buttons
   */
  switchLanguage(event) {
    let language = event.target.value;
    this.onLanguageChange(language);
  }
}
