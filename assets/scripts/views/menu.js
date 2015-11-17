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
    this.initLanguage();
  }

  /**
   * Initialize the language
   */
  initLanguage() {
    const $languageOptions = this.$languageSelect
      .querySelectorAll('.language-select__option');
    let i = 0

    for (i; i < $languageOptions.length; i++) {

      if ($languageOptions[i].checked) {
        this.onLanguageChange($languageOptions[i].value);
        break;
      }
    }
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
