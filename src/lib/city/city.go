package city

import (
	"appengine"
	"net/http"

	"lib/constants"
	"lib/position"
	"lib/spreadsheet"
	"lib/subdomain"
)

func Get(r *http.Request) {
	c := appengine.NewContext(r)

	calledSubdomain := subdomain.Get(r)
	userPosition := position.Get(r)

	c.Infof("This city: %v", calledSubdomain)
	c.Infof("The position: %v", userPosition)

	data := spreadsheet.Get(c, constants.CitySpreadsheetId, "od6")

	c.Infof("Data returned %v", data)
}
