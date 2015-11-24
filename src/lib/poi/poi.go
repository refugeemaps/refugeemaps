package poi

import (
	"appengine"
	"strings"

	"lib/position"
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

// Create a Poi from raw data
func Create(c appengine.Context, poiData map[string]string) (poi Poi, success bool) {
	success = false

	if poiData["Visible"] != "y" {
		return
	}

	for requiredKey := range requiredKeys {
		if poiData[requiredKey] == "" {
			return
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

	success = true
	poi = Poi{
		Category:     mapEmoji(poiData["Category"]),
		Name:         poiData["Name"],
		Address:      poiData["Address"],
		Position:     position.Create(c, poiData["Latitude"], poiData["Longitude"]),
		Contact:      poiData["Contact"],
		OpeningHours: poiData["OpeningHours"],
		Translations: translations,
	}

	return
}

// Whether the poi has a translation for that language or not
func (poi Poi) HasTranslationFor(language string) bool {
	for _, translation := range poi.Translations {
		if translation.Language == language {
			return true
		}
	}

	return false
}
