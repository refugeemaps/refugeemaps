package city

import (
	"appengine"
	"net/http"
	"strconv"

	"lib/constants"
	"lib/position"
	"lib/spreadsheet"
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
func Get(r *http.Request) {
	c := appengine.NewContext(r)

	calledSubdomain := subdomain.Get(r)
	userPosition := position.Get(r)

	c.Infof("This city: %v", calledSubdomain)
	c.Infof("The position: %v", userPosition)

	citiesData := spreadsheet.Get(c, constants.CitySpreadsheetId)
	cities := parseCities(c, citiesData)

	c.Infof("Cities: %v", cities)
}

// Parse the city data
func parseCities(c appengine.Context, citiesData []map[string]string) (cities []City) {
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
