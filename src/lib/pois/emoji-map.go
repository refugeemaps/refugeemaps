package pois

var emojiMap = map[string]string{
	"🙏": "religion",
	"💵": "finance",
	"🌍": "communication",
	"🛍": "store",
	"💊": "health",
	"⚽": "sport",
	"🏃": "kids",
	"🌳": "park",
	"☕": "cafe",
	"🏢": "authorities",
	"🎭": "culture",
	"🚽": "restrooms",
}

// Map the emojis to pure categories
func mapEmoji(emoji string) (category string) {
	category, exists := emojiMap[emoji]
	if exists == false {
		category = emoji
	}
	return
}
