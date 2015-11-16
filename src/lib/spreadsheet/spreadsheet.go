package spreadsheet

import (
	"appengine"
	"appengine/urlfetch"
	"encoding/json"
	"fmt"
	"io/ioutil"

	"lib/constants"
)

// Get one Spreadheet’s sheet data
func Get(c appengine.Context, spreadsheetId string, sheetId string) (data interface{}) {
	client := urlfetch.Client(c)
	url := fmt.Sprintf(constants.SheetUrl, spreadsheetId, sheetId)

	response, getErr := client.Get(url)
	defer response.Body.Close()
	if getErr != nil {
		c.Errorf("spreadsheet.Get: %v", getErr.Error())
		return
	}

	jsonData, readErr := ioutil.ReadAll(response.Body)
	if readErr != nil {
		c.Errorf("spreadsheet.ReadAll: %v", readErr.Error())
	}

	unmarshalError := json.Unmarshal(jsonData, &data)
	if unmarshalError != nil {
		c.Errorf("spreadsheet.Unmarshal: %v", unmarshalError.Error())
	}

	return data
}
