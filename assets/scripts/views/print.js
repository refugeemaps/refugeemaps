/* global google */

/**
 * The print view.
 */
export default class {
  /**
   * Initialize
   * @param {String} selector The print view container selector
   * @param {Array} hotspots The hotspots
   * @param {GoogleMapsBounds} mapBounds The bounds if the current viewport
   */
  constructor(selector, hotspots) {
    let staticMapUrl = this.getStaticMapUrl(hotspots),
      baseurl = window.location.href.substr(0, window.location.href.lastIndexOf('#'));

    this.$printContainer = document.createElement('div');
    this.$printContainer.classList.add(selector);

    this.$staticImage = document.createElement('img');
    this.$staticImage.classList.add(`${selector}__image`);
    this.$staticImage.setAttribute('src', staticMapUrl);

    this.$printContainer.appendChild(this.$staticImage);

    // add a QR code for the current url (without hash)
    this.$qrCode = document.createElement('img');
    this.$qrCode.src = 'https://chart.googleapis.com/chart?' +
      'chs=150x150&cht=qr&chl=' +
      encodeURIComponent(baseurl) +
      '&choe=UTF-8';
    this.$printContainer.appendChild(this.$qrCode);

    // add a text version of the link
    this.$textLink = document.createElement('span');
    this.$textLink.innerHTML = 'Latest version: ' + baseurl;
    this.$printContainer.appendChild(this.$textLink);

    let legendList = document.createElement('ul');
    legendList.classList.add('print-view__list');

    // add a legend from the filtered list
    hotspots.forEach(function(element, index) {
      let legendItem = document.createElement('li');
      legendItem.classList.add(element.category);
      legendItem.classList.add('print-view__list__item');

      let legendItemIndex = document.createElement('span');
      legendItemIndex.classList.add('print-view__list__item__index');
      legendItemIndex.textContent = index;

      let legendItemName = document.createElement('span');
      legendItemName.classList.add('print-view__list__item__name');
      legendItemName.textContent = element.name;

      let legendItemAddress = document.createElement('div');
      legendItemAddress.classList.add('print-view__list__item__address');
      legendItemAddress.textContent = element.address;

      legendItem.appendChild(legendItemIndex);
      legendItem.appendChild(legendItemName);
      legendItem.appendChild(legendItemAddress);

      legendList.appendChild(legendItem);
    });
    this.$printContainer.appendChild(legendList);

    document.body.appendChild(this.$printContainer);
  }

  /**
   * Get the current map bounds
   * @param {Object} hotspot A hotspot
   * @return {Boolean} If the hotspot is in the current viewport
   */
  isHotspotInBounds(hotspot) {
    let hotspotPosition =
      new google.maps.LatLng(hotspot.position.lat, hotspot.position.lat);

    return this.mapBounds.contains(hotspotPosition);
  }

  /**
   * Get the URL for the static maps api
   * @param {Array} hotspots A hotspot
   * @return {String} The url for the static maps api
   */
  getStaticMapUrl(hotspots) {
    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap?',
      mapSize = '1000x500',
      mapType = 'roadmap',
      key = 'AIzaSyAYrOxhjr-dH6ODKT5zkLScVL-4dP56I2U';

    let markers = '';
    hotspots.forEach((hotspot, index) => {
      if (index >= 25) {
        return;
      }
      markers += `&markers=color:red` +
      `%7Clabel:${this.getLetterFromNumber(index)}%7C` +
      `${hotspot.position.lat},${hotspot.position.lng}`;
    });

    return `${baseUrl}` +
      `size=${mapSize}` +
      `&maptype=${mapType}` +
      `${markers}` +
      `&key=${key}`;
  }

  /**
   * Map number to aphabetical equivalent
   * @param {Number} number The number which should be mapped
   * @return {String} The letter in uppercase
   */
  getLetterFromNumber(number) {
    return String.fromCharCode(97 + number).toUpperCase();
  }
}
