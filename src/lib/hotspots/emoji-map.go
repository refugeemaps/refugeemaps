package hotspots

var emojiMap = map[string]string{
	"🙏": "religion",
	"💵": "finance",
	"🌍": "communication",
	"🛍": "shopping",
	"💊": "health",
	"⚽": "sports",
	"🏃": "kids",
	"🌳": "parks",
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
