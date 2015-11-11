package refugeemaps

import (
	"appengine"
	"html/template"
	"net/http"
	"strings"

	"github.com/gorilla/mux"

	"lib/constants"
)

var (
	router    = mux.NewRouter()
	templates = template.Must(template.ParseGlob("templates/*"))
)

// Initialize
func init() {
	router.HandleFunc("/", RootHandler)
	router.NotFoundHandler = http.HandlerFunc(NotFoundHandler)

	http.Handle("/", router)
}

// RootHandler handles the main call.
func RootHandler(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	subdomain := getSubdomain(r)
	c.Infof("A city page?: %v", subdomain)

	templateExecuteError := templates.ExecuteTemplate(w, "indexPage", map[string]interface{}{
		"title":    constants.SiteName,
		"siteName": constants.SiteName,
	})
	if templateExecuteError != nil {
		c.Errorf("main.RootHandler template: %v", templateExecuteError)
		return
	}
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

// Get the subdomain
func getSubdomain(r *http.Request) (subdomain string) {
	host := r.URL.Host
	host = strings.TrimSpace(host)
	hostParts := strings.Split(host, ".")

	if len(hostParts) > 2 {
		subdomain = hostParts[0]
		subdomainParts := strings.Split(subdomain, "-dot-")

		if len(subdomainParts) > 1 {
			subdomain = subdomainParts[len(subdomainParts)-2]
		}
	}

	return
}
