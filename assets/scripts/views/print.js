/**
 * The print view.
 */
export default class {
  /**
   * Initialize
   * @param {String} selector The sidebar container selector
   * @param {Array} hotspots The Hotspots
   */
  constructor(selector, hotspots) {
    this.$printContainer = document.createElement('div');
    this.$printContainer.classList.add(selector);

    this.$staticImage = document.createElement('img');
    this.$staticImage.classList.add(`${selector}__image`);
    this.$staticImage.setAttribute('src', 'https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=AIzaSyAYrOxhjr-dH6ODKT5zkLScVL-4dP56I2U');

    this.$printContainer.appendChild(this.$staticImage);
    document.body.appendChild(this.$printContainer);
  }
}
