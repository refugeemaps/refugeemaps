package spreadsheet

import (
	"appengine"
	"appengine/urlfetch"
	"encoding/csv"
	"fmt"
	"time"

	"lib/constants"
)

type Request struct {
	Time time.Time
	Data []map[string]string
}

var cache = make(map[string]Request)

// Get one Spreadheet’s sheet data
func Get(c appengine.Context, spreadsheetId string) (data []map[string]string) {
	cachedRequest, exists := cache[spreadsheetId]

	if exists {
		cacheExpire := cachedRequest.Time.Add(time.Second * constants.CachingTime)
		useCache := time.Now().Before(cacheExpire)

		if useCache {
			data = cachedRequest.Data
			return
		}
	}

	url := fmt.Sprintf(constants.SheetUrl, spreadsheetId)
	rows := fetch(c, url)
	data = parse(c, rows)
	cache[spreadsheetId] = Request{time.Now(), data}

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
func parse(c appengine.Context, rows [][]string) (data []map[string]string) {
	for rowKey, row := range rows {
		if rowKey == 0 {
			continue
		}

		rowData := make(map[string]string)

		for key, value := range row {
			rowData[rows[0][key]] = value
		}

		data = append(data, rowData)
	}

	return
}
