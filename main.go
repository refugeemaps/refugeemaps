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

	api := router.PathPrefix("/_api/").Subrouter()
	api.HandleFunc("/locations/{locationId}/pois/", handler.PoisJSON)
	api.HandleFunc("/hotspots/{locationId}.json", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		url := fmt.Sprintf("/_api/locations/%v/pois/", vars["locationId"])
		http.Redirect(w, r, url, http.StatusMovedPermanently)
	})

	router.HandleFunc("/", handler.Root)
	router.NotFoundHandler = http.HandlerFunc(handler.NotFound)

	http.Handle("/", router)
}
