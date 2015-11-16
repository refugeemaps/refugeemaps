/**
 * The floating actions
 */
export default class {
  /**
   * Initialize
   */
  constructor({
    onMenuToggle = () => {},
    onFiltersToggle = () => {},
    onUserLocationSuccess = () => {},
    onUserLocationError = () => {}
  }) {
    this.$container = document.querySelector('.actions');
    this.$menuToggle = document.querySelector('.menu-toggle');
    this.$center = this.$container.querySelector('.center');
    this.$filtersToggle = this.$container.querySelector('.filters-toggle');

    if (!navigator.geolocation) {
      this.$center.remove();
    }

    this.onUserLocationSuccess = onUserLocationSuccess
    this.onUserLocationError = onUserLocationError

    if (this.$center) {
      this.$center.addEventListener('click', () => this.getUserLocation());
    }
    this.$filtersToggle.addEventListener('click', () => onFiltersToggle());
    this.$menuToggle.addEventListener('click', () => onMenuToggle());
  }

  /**
   * Get the user location
   * @return {Promise} Promise with the user location
   */
  getUserLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      const userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      this.onUserLocationSuccess(userPosition);
    }, () => {
      console.error('There was an error retrieving the geolocation…');
      this.onUserLocationError();
    });
  }

  /**
   * Show the actions
   */
  show() {
    this.$container.classList.remove('actions--hidden');
  }
}
