package locations

import (
	"appengine"

	"lib/languages"
)

func (location Location) GetUsedLanguages(c appengine.Context) (usedLanguages []languages.Language) {
	allPois := location.GetPois(c)
	allLanguages := languages.All()

	var languageMap = make(map[string]bool)

	for _, language := range allLanguages {
		languageMap[language.ID] = false
	}

	for _, poi := range allPois {
		for _, language := range allLanguages {
			if poi.HasTranslationFor(language.ID) {
				languageMap[language.ID] = true
			}
		}
	}

	for _, language := range allLanguages {
		if languageMap[language.ID] {
			usedLanguages = append(usedLanguages, language)
		}
	}

	if len(usedLanguages) == 0 {
		usedLanguages = append(usedLanguages, allLanguages[0])
	}

	return
}
