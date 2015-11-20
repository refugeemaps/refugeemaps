package handler

import (
	"appengine"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"

	"lib/location"
	"lib/pois"
)

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
