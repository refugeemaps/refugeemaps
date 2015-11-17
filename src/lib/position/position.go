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

// Create a new position from strings
func Create(c appengine.Context, lat string, lng string) (position Position) {
	convertedLat, latErr := strconv.ParseFloat(lat, 64)
	if latErr != nil {
		c.Errorf("getPosition.latErr: %v", latErr)
		return
	}
	convertedLng, lngErr := strconv.ParseFloat(lng, 64)
	if lngErr != nil {
		c.Errorf("getPosition.lngErr: %v", lngErr)
		return
	}

	position.Lat = convertedLat
	position.Lng = convertedLng

	return
}

// Get the position from a request
func GetFromRequest(r *http.Request) (position Position) {
	c := appengine.NewContext(r)

	latLng := r.Header.Get("X-AppEngine-CityLatLong")
	latLngParts := strings.Split(latLng, ",")

	if len(latLngParts) != 2 {
		return
	}

	position = Create(c, latLngParts[0], latLngParts[1])
	return
}
