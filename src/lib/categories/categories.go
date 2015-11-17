package categories

import (
	"appengine"
	"strings"

	"lib/constants"
	"lib/spreadsheet"
)

type Category struct {
	Key       string
	Checked   bool
	Languages []Language
}

type Language struct {
	Name string
	Text string
}

var allCategories = Category{
	Key:     "all",
	Checked: false,
	Languages: []Language{
		0: Language{"english", "All categories"},
		1: Language{"german", "Alle Kategorien"},
		2: Language{"arabic", "جميع الفئات"},
	},
}

// Load and parse the categories
func Load(c appengine.Context) (categories []Category) {
	categoriesData := spreadsheet.Get(c, constants.CategoriesSpreadsheetId)

	categories = append(categories, allCategories)

	for rowId, categoryData := range categoriesData {
		if rowId == 0 {
			continue
		}

		if categoryData["visible"] != "y" {
			continue
		}

		var languages []Language

		for key, value := range categoryData {
			if key == "visible" || key == "key" {
				continue
			}

			languages = append(languages, Language{strings.ToLower(key), value})
		}

		categories = append(categories, Category{
			Key:       categoryData["key"],
			Checked:   false,
			Languages: languages,
		})
	}

	return
}
