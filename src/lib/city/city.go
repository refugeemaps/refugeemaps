package city

import (
	"appengine"
	"net/http"

	"lib/position"
	"lib/subdomain"
)

type City struct {
	ID            string
	Name          string
	Lat           float64
	Lng           float64
	SpreadsheetId string
}

// Get the city according to subdomain or position from the request
func Get(r *http.Request) (city City) {
	c := appengine.NewContext(r)

	cities := loadCities(c)
	calledSubdomain := subdomain.Get(r)
	userPosition := position.Get(r)

	if calledSubdomain != "" {
		city = selectByID(cities, calledSubdomain)
	}

	if city.ID == "" && userPosition.Lat != 0 && userPosition.Lng != 0 {
		city = selectClosest(c, cities, userPosition)
	}

	if city.ID == "" {
		city = cities[0]
	}

	return
}
