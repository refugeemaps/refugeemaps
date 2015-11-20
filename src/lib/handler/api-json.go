package handler

import (
	"appengine"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"

	"lib/locations"
	"lib/pois"
)

// LocationsJSON returns all locations
func LocationsJSON(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	allLocations := locations.All(c)

	writeJSON(c, w, allLocations)
}

// PoisJSON returns pois
func PoisJSON(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	vars := mux.Vars(r)
	selectedLocation, exists := locations.GetById(r, vars["locationId"])
	if !exists {
		NotFoundJSON(w, r)
		return
	}

	locationPois := pois.Get(c, selectedLocation)

	writeJSON(c, w, locationPois)
}

// NotFound handles 404 in JSON
func NotFoundJSON(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	w.WriteHeader(http.StatusNotFound)

	writeJSON(c, w, map[string]string{
		"message": "Error 404 – Not found",
	})
}

// Convert something to JSON and write it
func writeJSON(c appengine.Context, w http.ResponseWriter, data interface{}) {
	dataJSON, jsonError := json.Marshal(data)
	if jsonError != nil {
		c.Errorf("handler.toJSON marshal: %v", jsonError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(dataJSON)
}
