package locations

import (
	"appengine"

	"lib/languages"
)

func (location Location) GetUsedLanguages(c appengine.Context) (usedLanguages []languages.Language) {
	allPois := location.GetPois(c)
	allLanguages := languages.All()

	for _, language := range allLanguages {
		for _, poi := range allPois {
			if poi.HasTranslationFor(language.ID) {
				usedLanguages = append(usedLanguages, language)
				break
			}
		}
	}

	if len(usedLanguages) == 0 {
		usedLanguages = append(usedLanguages, allLanguages[0])
	}

	return
}
