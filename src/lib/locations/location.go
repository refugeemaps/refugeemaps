package locations

import (
	"lib/categories"
	"lib/languages"
	"lib/poi"
	"lib/position"
)

type Location struct {
	ID            string            `json:"id"`
	Name          string            `json:"name"`
	Position      position.Position `json:"position"`
	SpreadsheetId string            `json:"spreadsheetId,omitempty"`
	SheetId       string            `json:"sheetId,omitempty"`
}

type LocationData struct {
	Pois       []poi.Poi             `json:"pois,omitempty"`
	Categories []categories.Category `json:"categories,omitempty"`
	Languages  []languages.Language  `json:"languages,omitempty"`
}
