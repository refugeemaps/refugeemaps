package locations

import (
	"appengine"

	"lib/poi"
	"lib/spreadsheet"
)

// Get all the pois for that location
func (location Location) GetPois(c appengine.Context) (allPois []poi.Poi) {
	headerRow := 1
	poisData := spreadsheet.Get(c, location.SpreadsheetId, location.SheetId, headerRow)

	for _, poiData := range poisData {
		newPoi, success := poi.Create(c, poiData)

		if success {
			allPois = append(allPois, newPoi)
		}
	}

	return
}
