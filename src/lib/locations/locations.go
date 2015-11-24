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
func All(c appengine.Context) (locations []Location) {
	sheetId := "0"
	headerRow := 0
	locationsData := spreadsheet.Get(c, constants.LocationSpreadsheetId, sheetId, headerRow)

	for _, locationData := range locationsData {
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

		locations = append(locations, location)
	}

	return
}

// Get the location according to subdomain or position from the request
func Get(r *http.Request) (location Location) {
	c := appengine.NewContext(r)

	locations := All(c)
	calledSubdomain := subdomain.GetFromRequest(r)
	userPosition := position.GetFromRequest(r)

	if calledSubdomain != "" {
		location = selectByID(locations, calledSubdomain)
	}

	if location.ID == "" && userPosition.Lat != 0 && userPosition.Lng != 0 {
		location = selectClosest(c, locations, userPosition)
	}

	if location.ID == "" {
		location = locations[0]
	}

	return
}

// Get a location by it’s id
func GetById(r *http.Request, locationId string) (location Location, exists bool) {
	c := appengine.NewContext(r)

	locations := All(c)
	location = selectByID(locations, locationId)
	exists = location.ID != ""

	return
}
