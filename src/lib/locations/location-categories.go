package locations

import (
	"appengine"

	"lib/categories"
)

func (location Location) GetUsedCategories(c appengine.Context) (usedCategories []categories.Category) {
	allPois := location.GetPois(c)
	allCategories := categories.All(c)

	for _, category := range allCategories {
		if category.Key == "all" {
			usedCategories = append(usedCategories, category)
			continue
		}

		for _, poi := range allPois {
			if poi.Category == category.Key {
				usedCategories = append(usedCategories, category)
				break
			}
		}
	}

	return
}
