package refugeemaps

import (
	"net/http"

	"github.com/gorilla/mux"

	"lib/handler"
)

var router = mux.NewRouter()

// Initialize
func init() {
	router.HandleFunc("/", handler.RootHandler)
	router.HandleFunc("/_api/hotspots/{locationId}.json", handler.PoisJSONHandler)
	router.NotFoundHandler = http.HandlerFunc(handler.NotFoundHandler)

	http.Handle("/", router)
}
