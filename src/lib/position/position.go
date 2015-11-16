package position

import (
	"appengine"
	"net/http"
	"strconv"
	"strings"
)

type Position struct {
	Lat float64
	Lng float64
}

func Get(r *http.Request) (position Position) {
	c := appengine.NewContext(r)

	latLng := r.Header.Get("X-AppEngine-CityLatLong")
	latLngParts := strings.Split(latLng, ",")

	if len(latLngParts) != 2 {
		return
	}

	lat, latErr := strconv.ParseFloat(latLngParts[0], 64)
	if latErr != nil {
		c.Errorf("getPosition.latErr: %v", latErr)
		return
	}
	lng, lngErr := strconv.ParseFloat(latLngParts[1], 64)
	if lngErr != nil {
		c.Errorf("getPosition.lngErr: %v", lngErr)
		return
	}

	position.Lat = lat
	position.Lng = lng

	return
}
