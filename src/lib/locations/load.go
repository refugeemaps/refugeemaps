package locations

import (
	"appengine"

	"lib/constants"
	"lib/position"
	"lib/spreadsheet"
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
