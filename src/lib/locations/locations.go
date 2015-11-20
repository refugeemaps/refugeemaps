package locations

import (
	"appengine"
	"net/http"

	"lib/position"
	"lib/subdomain"
)

type Location struct {
	ID            string
	Name          string
	Position      position.Position
	SpreadsheetId string
	SheetId       string
}

// Get the location according to subdomain or position from the request
func Get(r *http.Request) (location Location) {
	c := appengine.NewContext(r)

	cities := load(c)
	calledSubdomain := subdomain.GetFromRequest(r)
	userPosition := position.GetFromRequest(r)

	if calledSubdomain != "" {
		location = selectByID(cities, calledSubdomain)
	}

	if location.ID == "" && userPosition.Lat != 0 && userPosition.Lng != 0 {
		location = selectClosest(c, cities, userPosition)
	}

	if location.ID == "" {
		location = cities[0]
	}

	return
}

// Get a location by it’s id
func GetById(r *http.Request, locationId string) (location Location, exists bool) {
	c := appengine.NewContext(r)

	cities := load(c)
	location = selectByID(cities, locationId)
	exists = location.ID != ""

	return
}
