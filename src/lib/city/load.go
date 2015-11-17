package city

import (
	"appengine"
	"strconv"

	"lib/constants"
	"lib/spreadsheet"
)

// Parse the city data
func load(c appengine.Context) (cities []City) {
	citiesData := spreadsheet.Get(c, constants.CitySpreadsheetId)

	for _, cityData := range citiesData {
		if cityData["visible"] != "y" {
			continue
		}

		lat, latErr := strconv.ParseFloat(cityData["Lat"], 64)
		if latErr != nil {
			c.Errorf("getPosition.latErr: %v", latErr)
			continue
		}
		lng, lngErr := strconv.ParseFloat(cityData["Lng"], 64)
		if lngErr != nil {
			c.Errorf("getPosition.lngErr: %v", lngErr)
			continue
		}

		city := City{
			ID:            cityData["ID"],
			Name:          cityData["City"],
			Lat:           lat,
			Lng:           lng,
			SpreadsheetId: cityData["Spreadsheet ID"],
		}

		cities = append(cities, city)
	}

	return
}
