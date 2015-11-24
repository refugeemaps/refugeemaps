package languages

type Language struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	IsRtl bool   `json:"isRtl"`
}

// Get all the languages
func All() []Language {
	return []Language{
		Language{"english", "English", false},
		Language{"german", "Deutsch", false},
		Language{"arabic", "العربية", true},
	}
}
