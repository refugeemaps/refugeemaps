package locations

import (
	"appengine"
	"math"

	"lib/position"
)

const earthRadius = 6371

// Get the correct location from all the locations depending on the passed ID
func selectByID(locations []Location, id string) (selectedLocation Location) {
	for _, location := range locations {
		if location.ID == id {
			selectedLocation = location
			return
		}
	}

	return
}

// Get the closest location from all the locations depending on the passed user position
func selectClosest(ccc appengine.Context, locations []Location, userPosition position.Position) (selectedLocation Location) {
	var closestDistance float64

	for _, location := range locations {
		diffLat := rad(location.Position.Lat - userPosition.Lat)
		diffLong := rad(location.Position.Lng - userPosition.Lng)
		a := math.Sin(diffLat/2)*math.Sin(diffLat/2) + math.Cos(rad(userPosition.Lat))*math.Cos(rad(userPosition.Lat))*math.Sin(diffLong/2)*math.Sin(diffLong/2)
		c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
		distance := earthRadius * c

		ccc.Infof("The distance %v of %v", distance, location.Name)
		ccc.Infof("Closest? %v", distance < closestDistance || closestDistance == 0)

		if distance < closestDistance || closestDistance == 0 {
			closestDistance = distance
			selectedLocation = location
		}
	}

	return
}

// Convert from degrees to radians
func rad(x float64) float64 {
	return x * math.Pi / 180
}
