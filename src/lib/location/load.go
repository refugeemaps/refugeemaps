package location

import (
	"appengine"

	"lib/constants"
	"lib/position"
	"lib/spreadsheet"
)

// Parse the location data
func load(c appengine.Context) (cities []Location) {
	sheetId := "0"
	headerRow := 0
	citiesData := spreadsheet.Get(c, constants.LocationSpreadsheetId, sheetId, headerRow)

	for _, locationData := range citiesData {
		if locationData["visible"] != "y" {
			continue
		}

		location := Location{
			ID:            locationData["ID"],
			Name:          locationData["Location"],
			Position:      position.Create(c, locationData["lat"], locationData["lng"]),
			SpreadsheetId: locationData["Spreadsheet ID"],
			SheetId:       locationData["Sheet ID"],
		}

		cities = append(cities, location)
	}

	return
}
