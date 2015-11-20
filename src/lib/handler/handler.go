package handler

import (
	"appengine"
	"html/template"
	"net/http"
	"strings"

	"lib/categories"
	"lib/constants"
	"lib/locations"
)

var templates = template.Must(template.ParseGlob("templates/*"))

// Root handles the main call.
func Root(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	selectedLocation := locations.Get(r)
	allCategories := categories.Load(c)

	templateExecuteError := templates.ExecuteTemplate(w, "indexPage", map[string]interface{}{
		"title":      constants.SiteName,
		"siteName":   constants.SiteName,
		"categories": allCategories,
		"location":   selectedLocation,
	})
	if templateExecuteError != nil {
		c.Errorf("main.Root template: %v", templateExecuteError)
		return
	}
}

// NotFound handles 404
func NotFound(w http.ResponseWriter, r *http.Request) {
	isApi := strings.HasPrefix(r.URL.Path, "/_api/")

	if isApi {
		NotFoundJSON(w, r)
		return
	}

	c := appengine.NewContext(r)

	w.WriteHeader(http.StatusNotFound)
	templateExecuteError := templates.ExecuteTemplate(w, "404Page", map[string]interface{}{
		"title":    "Error 404 – Not found",
		"siteName": constants.SiteName,
	})
	if templateExecuteError != nil {
		c.Errorf("main.NotFound template: %v", templateExecuteError)
		return
	}
}
