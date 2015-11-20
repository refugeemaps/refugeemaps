package locations

import (
	"appengine"
	"net/http"

	"lib/position"
	"lib/subdomain"
)

type Location struct {
	ID            string            `json:"id"`
	Name          string            `json:"name"`
	Position      position.Position `json:"position"`
	SpreadsheetId string            `json:"spreadsheetId,omitempty"`
	SheetId       string            `json:"sheetId,omitempty"`
}

// Get the location according to subdomain or position from the request
func Get(r *http.Request) (location Location) {
	c := appengine.NewContext(r)

	cities := All(c)
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

	cities := All(c)
	location = selectByID(cities, locationId)
	exists = location.ID != ""

	return
}
