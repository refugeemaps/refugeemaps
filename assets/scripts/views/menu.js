import Sidebar from './sidebar';

/**
 * The main menu
 */
export default class extends Sidebar {
  /**
   * Initialize
   */
  constructor({
    onLanguageChange = () => {}
  }) {
    super('.menu');
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
}
