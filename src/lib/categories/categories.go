package categories

import (
	"appengine"
	"strings"

	"lib/constants"
	"lib/spreadsheet"
	"lib/translation"
)

type Category struct {
	Key          string
	Translations []translation.Translation
}

var allCategories = Category{
	Key: "all",
	Translations: []translation.Translation{
		0: translation.Translation{"english", "All categories"},
		1: translation.Translation{"german", "Alle Kategorien"},
		2: translation.Translation{"arabic", "جميع الفئات"},
	},
}

// Load and parse the categories
func All(c appengine.Context) (categories []Category) {
	sheetId := "0"
	headerRow := 0
	categoriesData := spreadsheet.Get(c, constants.CategoriesSpreadsheetId, sheetId, headerRow)

	categories = append(categories, allCategories)

	for rowId, categoryData := range categoriesData {
		if rowId == 0 {
			continue
		}

		if categoryData["visible"] != "y" {
			continue
		}

		var translations []translation.Translation

		for key, value := range categoryData {
			if key == "visible" || key == "key" {
				continue
			}

			translations = append(translations, translation.Translation{strings.ToLower(key), value})
		}

		categories = append(categories, Category{
			Key:          categoryData["key"],
			Translations: translations,
		})
	}

	return
}
