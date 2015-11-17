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
	Position      position.Position
	SpreadsheetId string
	SheetId       string
}

// Get the city according to subdomain or position from the request
func Get(r *http.Request) (city City) {
	c := appengine.NewContext(r)

	cities := load(c)
	calledSubdomain := subdomain.GetFromRequest(r)
	userPosition := position.GetFromRequest(r)

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

// Get a city by it’s id
func GetById(r *http.Request, cityId string) (city City, exists bool) {
	c := appengine.NewContext(r)

	cities := load(c)
	city = selectByID(cities, cityId)
	exists = city.ID != ""

	return
}
