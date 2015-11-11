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
    this.$body = this.$container.querySelector('.infowindow__body');

    this.$close.addEventListener('click', () => this.hide());
  }

  /**
   * Show the infowindow
   * @param {Object} hotspot The hotspot to show
   */
  show(hotspot) {
    this.$container.classList.remove('infowindow--hidden');

    let content = '';

    if (hotspot.name) {
      content += `<h4 class="infowindow__title">${hotspot.name}</h4><hr>`;
    }

    if (hotspot.address) {
      content += `<div class="infowindow__address">
        <img src="static/images/marker-stroked-24@2x.png"
          class="infowindow__address__image">
        <span class="infowindow__address__text">${hotspot.address}</span>
      </div><hr>`;
    }

    if (hotspot.descriptionenglish) {
      content += `<div class="infowindow__description">
        ${hotspot.descriptionenglish}</div><hr>`;
    }

    if (hotspot.descriptionforeign) {
      content += `<div class="infowindow__description">
        ${hotspot.descriptionforeign}</div><hr>`;
    }

    if (hotspot.openinghours) {
      content += `<div class="infowindow__hours">
        <img src="static/images/clock.png" class="infowindow__hours__image">
        <span class="infowindow__hours__text">${hotspot.openinghours}</span>
      </div>`;
    }

    this.$body.innerHTML = content;
  }

  /**
   * Hide the infowindow
   */
  hide() {
    this.$container.classList.add('infowindow--hidden');
    this.$body.innerHTML = '';
  }
}
