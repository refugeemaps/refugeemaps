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
    let i = 0,
      foundLanguage = false;

    for (i; i < $languageOptions.length; i++) {
      if ($languageOptions[i].checked) {
        foundLanguage = true;
        this.onLanguageChange($languageOptions[i].value);
        break;
      }
    }

    if (!foundLanguage) {
      const $defaultLanguage = this.$languageSelect
        .querySelector('.language-select__option');

      $defaultLanguage.setAttribute('checked', 'checked');
      this.onLanguageChange($defaultLanguage.value);
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
