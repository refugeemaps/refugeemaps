package spreadsheet

import (
	"appengine"
	"appengine/urlfetch"
	"encoding/csv"
	"fmt"

	"lib/constants"
)

// Get one Spreadheet’s sheet data
func Get(c appengine.Context, spreadsheetId string, sheetId string, headerRow int) (data []map[string]string) {
	url := fmt.Sprintf(constants.SheetUrl, spreadsheetId, sheetId)
	rows := fetch(c, url)
	data = parse(c, rows, headerRow)
	return
}

// Fetch the Spreadsheet
func fetch(c appengine.Context, url string) (rows [][]string) {
	client := urlfetch.Client(c)

	response, getErr := client.Get(url)
	defer response.Body.Close()
	if getErr != nil {
		c.Errorf("spreadsheet.Get: %v", getErr.Error())
		return
	}

	reader := csv.NewReader(response.Body)
	reader.Comma = '\t'

	rows, readErr := reader.ReadAll()
	if readErr != nil {
		c.Errorf("spreadsheet.ReadCsv: %v", readErr.Error())
		return
	}

	return
}

// Parse the spreadsheet and assume first row as header
func parse(c appengine.Context, rows [][]string, headerRow int) (data []map[string]string) {
	for rowKey, row := range rows {
		if rowKey <= headerRow {
			continue
		}

		rowData := make(map[string]string)

		for key, value := range row {
			rowData[rows[headerRow][key]] = value
		}

		data = append(data, rowData)
	}

	return
}
