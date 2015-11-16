package city

import (
	"appengine"
	"math"

	"lib/position"
)

const earthRadius = 6371

// Get the correct city from all the cities depending on the passed ID
func selectByID(cities []City, id string) (selectedCity City) {
	for _, city := range cities {
		if city.ID == id {
			selectedCity = city
			return
		}
	}

	return
}

// Get the closest city from all the cities depending on the passed user position
func selectClosest(ccc appengine.Context, cities []City, userPosition position.Position) (selectedCity City) {
	var closestDistance float64

	for _, city := range cities {
		diffLat := rad(city.Lat - userPosition.Lat)
		diffLong := rad(city.Lng - userPosition.Lng)
		a := math.Sin(diffLat/2)*math.Sin(diffLat/2) + math.Cos(rad(userPosition.Lat))*math.Cos(rad(userPosition.Lat))*math.Sin(diffLong/2)*math.Sin(diffLong/2)
		c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
		distance := earthRadius * c

		ccc.Infof("The distance %v of %v", distance, city.Name)
		ccc.Infof("Closest? %v", distance < closestDistance || closestDistance == 0)

		if distance < closestDistance || closestDistance == 0 {
			closestDistance = distance
			selectedCity = city
		}
	}

	return
}

// Convert from degrees to radians
func rad(x float64) float64 {
	return x * math.Pi / 180
}
