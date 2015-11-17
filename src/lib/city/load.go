package city

import (
	"appengine"

	"lib/constants"
	"lib/position"
	"lib/spreadsheet"
)

// Parse the city data
func load(c appengine.Context) (cities []City) {
	sheetId := "0"
	headerRow := 0
	citiesData := spreadsheet.Get(c, constants.CitySpreadsheetId, sheetId, headerRow)

	for _, cityData := range citiesData {
		if cityData["visible"] != "y" {
			continue
		}

		city := City{
			ID:            cityData["ID"],
			Name:          cityData["City"],
			Position:      position.Create(c, cityData["lat"], cityData["lng"]),
			SpreadsheetId: cityData["Spreadsheet ID"],
			SheetId:       cityData["Sheet ID"],
		}

		cities = append(cities, city)
	}

	return
}
