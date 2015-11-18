/**
 * The print view.
 */
export default class {
  /**
   * Initialize
   * @param {String} selector The sidebar container selector
   */
  constructor(selector) {
    this.$printContainer = document.createElement('div');
    this.$printContainer.classList.add(selector);

    this.$staticImage = document.createElement('img');
    this.$staticImage.classList.add(`${selector}__image`);
    this.$staticImage.setAttribute('src', 'https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=AIzaSyAYrOxhjr-dH6ODKT5zkLScVL-4dP56I2U');

    this.$printContainer.appendChild(this.$staticImage);

    // add a QR code for the current url (without hash)
    this.$qrCode = document.createElement('img');
    let baseurl = window.location.href.substr(0,window.location.href.lastIndexOf('#'));
    this.$qrCode.src= 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl='+
        encodeURIComponent(baseurl)+
        '&choe=UTF-8';
    this.$printContainer.appendChild(this.$qrCode);

    // add a text version of the link
    this.$textLink = document.createElement('span');
    this.$textLink.innerHTML = "Latest version: " + baseurl;
    this.$printContainer.appendChild(this.$textLink);

    document.body.appendChild(this.$printContainer);
  }
}
