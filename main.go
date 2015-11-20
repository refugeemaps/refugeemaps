package refugeemaps

import (
	"appengine"
	"encoding/json"
	"html/template"
	"net/http"

	"github.com/gorilla/mux"

	"lib/categories"
	"lib/constants"
	"lib/location"
	"lib/pois"
)

var (
	router    = mux.NewRouter()
	templates = template.Must(template.ParseGlob("templates/*"))
)

// Initialize
func init() {
	router.HandleFunc("/", RootHandler)
	router.HandleFunc("/_api/hotspots/{locationId}.json", PoisJSONHandler)
	router.NotFoundHandler = http.HandlerFunc(NotFoundHandler)

	http.Handle("/", router)
}

// RootHandler handles the main call.
func RootHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	selectedLocation := location.Get(r)
	allCategories := categories.Load(c)

	templateExecuteError := templates.ExecuteTemplate(w, "indexPage", map[string]interface{}{
		"title":      constants.SiteName,
		"siteName":   constants.SiteName,
		"categories": allCategories,
		"location":   selectedLocation,
	})
	if templateExecuteError != nil {
		c.Errorf("main.RootHandler template: %v", templateExecuteError)
		return
	}
}

// PoisJSONHandler returns pois
func PoisJSONHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	vars := mux.Vars(r)
	selectedLocation, exists := location.GetById(r, vars["locationId"])
	if !exists {
		NotFoundJSONHandler(w, r)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(pois.GetAsJSON(c, selectedLocation))
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

// NotFoundHandler handles 404 in JSON
func NotFoundJSONHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	errorResponse, jsonError := json.Marshal(map[string]string{
		"message": "Error 404 – Not found",
	})
	if jsonError != nil {
		c.Errorf("main.NotFoundJSONHandler marshal: %v", jsonError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(404)
	w.Write(errorResponse)
}
