package hotspots

import (
	"appengine"
	"encoding/json"
	"strings"

	"lib/city"
	"lib/position"
	"lib/spreadsheet"
	"lib/translation"
)

type Hotspot struct {
	Category     string
	Name         string
	Address      string
	Position     position.Position
	Contact      string
	OpeningHours string
	Description  string
	Translations []translation.Translation
}

var nonTranslationKeys = map[string]struct{}{
	"Visible":       {},
	"Category":      {},
	"Name":          {},
	"Address":       {},
	"Latitude":      {},
	"Longitude":     {},
	"Contact":       {},
	"Opening Hours": {},
	"Description":   {},
}

// Get the hotspots as JSON
func GetAsJSON(c appengine.Context, selectedCity city.City) (hotspotsJSON []byte) {
	hotspots := Get(c, selectedCity)

	hotspotsJSON, jsonError := json.Marshal(hotspots)
	if jsonError != nil {
		c.Errorf("hotspots.GetAsJSON marshal: %v", jsonError)
		return
	}

	return
}

// Load and parse the hotspots
func Get(c appengine.Context, selectedCity city.City) (hotspots []Hotspot) {
	headerRow := 1
	hotspotsData := spreadsheet.Get(c, selectedCity.SpreadsheetId, selectedCity.SheetId, headerRow)

	for _, hotspotData := range hotspotsData {
		if hotspotData["Visible"] != "y" {
			continue
		}

		var translations []translation.Translation

		for key, value := range hotspotData {
			_, exists := nonTranslationKeys[key]
			if exists || key == "" {
				continue
			}

			translations = append(translations, translation.Translation{strings.ToLower(key), value})
		}

		hotspots = append(hotspots, Hotspot{
			Category:     hotspotData["Category"],
			Name:         hotspotData["Name"],
			Address:      hotspotData["Address"],
			Position:     position.Create(c, hotspotData["Latitude"], hotspotData["Longitude"]),
			Contact:      hotspotData["Contact"],
			OpeningHours: hotspotData["OpeningHours"],
			Description:  hotspotData["Description"],
			Translations: translations,
		})
	}

	return
}
