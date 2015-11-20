package locations

import (
	"appengine"
	"net/http"

	"lib/constants"
	"lib/position"
	"lib/spreadsheet"
	"lib/subdomain"
)

// Parse the location data
func All(c appengine.Context) (cities []Location) {
	sheetId := "0"
	headerRow := 0
	citiesData := spreadsheet.Get(c, constants.LocationSpreadsheetId, sheetId, headerRow)

	for _, locationData := range citiesData {
		if locationData["visible"] != "y" {
			continue
		}

		location := Location{
			ID:            locationData["ID"],
			Name:          locationData["City"],
			Position:      position.Create(c, locationData["Lat"], locationData["Lng"]),
			SpreadsheetId: locationData["Spreadsheet ID"],
			SheetId:       locationData["Sheet ID"],
		}

		cities = append(cities, location)
	}

	return
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
