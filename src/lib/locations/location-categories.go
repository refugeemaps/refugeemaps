package locations

import (
	"appengine"

	"lib/categories"
)

func (location Location) GetUsedCategories(c appengine.Context) (usedCategories []categories.Category) {
	allPois := location.GetPois(c)
	allCategories := categories.All(c)

	var categoryMap = make(map[string]bool)

	for _, category := range allCategories {
		if category.Key == "all" {
			categoryMap[category.Key] = true
		} else {
			categoryMap[category.Key] = false
		}
	}

	for _, poi := range allPois {
		for _, category := range allCategories {
			if poi.Category == category.Key {
				categoryMap[category.Key] = true
			}
		}
	}

	for _, category := range allCategories {
		if categoryMap[category.Key] {
			usedCategories = append(usedCategories, category)
		}
	}

	return
}
