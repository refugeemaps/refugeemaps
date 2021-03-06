package refugeemaps

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"

	"lib/handler"
)

var router = mux.NewRouter()

// Initialize
func init() {
	router.StrictSlash(true)

	api := router.PathPrefix("/_api/").Methods("GET").Subrouter()
	api.HandleFunc("/locations/", handler.LocationsJSON)
	api.HandleFunc("/locations/{locationId}/", handler.LocationJSON)
	api.HandleFunc("/locations/{locationId}/categories/", handler.LocationCategoriesJSON)
	api.HandleFunc("/locations/{locationId}/languages/", handler.LocationLanguagesJSON)
	api.HandleFunc("/locations/{locationId}/pois/", handler.LocationPoisJSON)

	// Legacy URL redirect
	api.HandleFunc("/hotspots/{locationId}.json", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		url := fmt.Sprintf("/_api/locations/%v/pois/", vars["locationId"])
		http.Redirect(w, r, url, http.StatusMovedPermanently)
	})

	router.HandleFunc("/", handler.Root).Methods("GET")
	router.NotFoundHandler = http.HandlerFunc(handler.NotFound)

	http.Handle("/", router)
}
