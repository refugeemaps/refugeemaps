package refugeemaps

import (
	"net/http"

	"github.com/gorilla/mux"

	"lib/handler"
)

var router = mux.NewRouter()

// Initialize
func init() {
	router.HandleFunc("/", handler.Root)
	router.HandleFunc("/_api/hotspots/{locationId}.json", handler.PoisJSON)
	router.NotFoundHandler = http.HandlerFunc(handler.NotFound)

	http.Handle("/", router)
}
