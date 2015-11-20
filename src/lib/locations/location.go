package locations

import (
	"lib/position"
)

type Location struct {
	ID            string            `json:"id"`
	Name          string            `json:"name"`
	Position      position.Position `json:"position"`
	SpreadsheetId string            `json:"spreadsheetId,omitempty"`
	SheetId       string            `json:"sheetId,omitempty"`
}
