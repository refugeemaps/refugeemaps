package refugeemaps

import (
	"appengine"
	"html/template"
	"net/http"

	"github.com/gorilla/mux"

	"lib/categories"
	"lib/city"
	"lib/constants"
	"lib/hotspots"
)

var (
	router    = mux.NewRouter()
	templates = template.Must(template.ParseGlob("templates/*"))
)

// Initialize
func init() {
	router.HandleFunc("/", RootHandler)
	router.HandleFunc("/_api/hotspots/{cityId}.json", HotspotsJSONHandler)
	router.NotFoundHandler = http.HandlerFunc(NotFoundHandler)

	http.Handle("/", router)
}

// RootHandler handles the main call.
func RootHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	selectedCity := city.Get(r)
	allCategories := categories.Load(c)

	templateExecuteError := templates.ExecuteTemplate(w, "indexPage", map[string]interface{}{
		"title":      constants.SiteName,
		"siteName":   constants.SiteName,
		"categories": allCategories,
		"city":       selectedCity,
	})
	if templateExecuteError != nil {
		c.Errorf("main.RootHandler template: %v", templateExecuteError)
		return
	}
}

// HotspotsJSONHandler returns hotspots
func HotspotsJSONHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	vars := mux.Vars(r)
	selectedCity, exists := city.GetById(r, vars["cityId"])
	if !exists {
		NotFoundHandler(w, r)
		return
	}

	selectedCity.SpreadsheetId = "15Na8ihDIljcRatsPkNQFA1rQLM6C08AC0VJVyGFKioI"

	w.Header().Set("Content-Type", "application/json")
	w.Write(hotspots.GetAsJSON(c, selectedCity))
}

// NotFoundHandler handles 404
func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	w.WriteHeader(404)
	templateExecuteError := templates.ExecuteTemplate(w, "404Page", map[string]interface{}{
		"title":    "Error 404 – Not found",
		"siteName": constants.SiteName,
	})
	if templateExecuteError != nil {
		c.Errorf("main.NotFoundHandler template: %v", templateExecuteError)
		return
	}
}
