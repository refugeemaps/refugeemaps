package pois

import (
	"appengine"
	"strings"

	"lib/locations"
	"lib/position"
	"lib/spreadsheet"
	"lib/translation"
)

type Poi struct {
	Category     string                    `json:"category,omitempty"`
	Name         string                    `json:"name,omitempty"`
	Address      string                    `json:"address,omitempty"`
	Position     position.Position         `json:"position"`
	Contact      string                    `json:"contact,omitempty"`
	OpeningHours string                    `json:"openingHours,omitempty"`
	Translations []translation.Translation `json:"translations"`
}

var requiredKeys = map[string]struct{}{
	"Name":        {},
	"Latitude":    {},
	"Longitude":   {},
	"Description": {},
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

// Load and parse the pois
func Get(c appengine.Context, selectedLocation locations.Location) (pois []Poi) {
	headerRow := 1
	poisData := spreadsheet.Get(c, selectedLocation.SpreadsheetId, selectedLocation.SheetId, headerRow)

	for _, poiData := range poisData {
		if poiData["Visible"] != "y" {
			continue
		}

		for requiredKey := range requiredKeys {
			if poiData[requiredKey] == "" {
				continue
			}
		}

		var translations []translation.Translation
		translations = append(translations, translation.Translation{"english", poiData["Description"]})

		for key, value := range poiData {
			_, exists := nonTranslationKeys[key]
			if exists || key == "" {
				continue
			}

			translations = append(translations, translation.Translation{strings.ToLower(key), value})
		}

		pois = append(pois, Poi{
			Category:     mapEmoji(poiData["Category"]),
			Name:         poiData["Name"],
			Address:      poiData["Address"],
			Position:     position.Create(c, poiData["Latitude"], poiData["Longitude"]),
			Contact:      poiData["Contact"],
			OpeningHours: poiData["OpeningHours"],
			Translations: translations,
		})
	}

	return
}
