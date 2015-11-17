package subdomain

import (
	"net/http"
	"strings"
)

// Get the subdomain
func GetFromRequest(r *http.Request) (subdomain string) {
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
