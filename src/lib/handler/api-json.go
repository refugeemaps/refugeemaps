package handler

import (
	"appengine"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"

	"lib/locations"
	"lib/pois"
)

// PoisJSON returns pois
func PoisJSON(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	vars := mux.Vars(r)
	selectedLocation, exists := locations.GetById(r, vars["locationId"])
	if !exists {
		NotFoundJSON(w, r)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(pois.GetAsJSON(c, selectedLocation))
}

// NotFound handles 404 in JSON
func NotFoundJSON(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	errorResponse, jsonError := json.Marshal(map[string]string{
		"message": "Error 404 – Not found",
	})
	if jsonError != nil {
		c.Errorf("main.NotFoundJSON marshal: %v", jsonError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNotFound)
	w.Write(errorResponse)
}
