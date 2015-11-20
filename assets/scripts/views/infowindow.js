import find from 'array-find';

/**
 * The infowindow
 */
export default class {
  /**
   * Initialize
   */
  constructor() {
    this.$container = document.querySelector('.infowindow');
    this.$close = this.$container.querySelector('.infowindow__close');
    this.$title = this.$container.querySelector('.infowindow__header__title');
    this.$link = this.$container.querySelector('.infowindow__maplink');
    this.$location = this.$container
      .querySelector('.infowindow__body__row__content--location');
    this.$time = this.$container
      .querySelector('.infowindow__body__row__content--time');
    this.$info = this.$container
      .querySelector('.infowindow__body__row__content--info');

    this.poi = null;
    this.language = null;

    this.$link.addEventListener('click', () => this.openMaps());
    this.$close.addEventListener('click', () => this.hide());
  }

  /**
   * Change to the new language
   * @param  {String} language The new language
   */
  changeLanguage(language) {
    this.language = language;
    this.render();
  }

  /**
   * Show the infowindow
   * @param {Object} poi The poi to show
   */
  show(poi) {
    this.poi = poi;
    this.render();
  }

  /**
   * Open the default maps application.
   */
  openMaps() {
    const position = this.poi.position,
      query = `${this.poi.address}/@${position.lat},${position.lng}`,
      url = 'https://www.google.com/maps/place/' + query;

    window.open(url, '_blank');
  }

  /**
   * Render the infowindow according to the state
   */
  render() {
    if (!this.poi) {
      return;
    }

    const english = find(this.poi.translations, translation => {
        return translation.language === 'english';
      }),
      currentTranslation = find(this.poi.translations, translation => {
        return translation.language === this.language;
      }),
      description = (currentTranslation && currentTranslation.text) ||
        english.text;

    this.$container.classList.remove('infowindow--hidden');
    this.$title.textContent = this.poi.name;

    [
      {$el: this.$location, value: this.poi.address},
      {$el: this.$time, value: this.poi.openingHours},
      {$el: this.$info, value: description}
    ].forEach(data => {
      if (data.value && data.value !== '') {
        data.$el.parentNode.classList.remove('infowindow__body__row--hidden');
        data.$el.textContent = data.value;
      } else {
        data.$el.parentNode.classList.add('infowindow__body__row--hidden');
        data.$el.textContent = '';
      }
    });
  }

  /**
   * Hide the infowindow
   */
  hide() {
    this.$container.classList.add('infowindow--hidden');
    this.$title.textContent = '';
    this.$location.textContent = '';
    this.$time.textContent = '';
    this.$info.textContent = '';
  }
}
