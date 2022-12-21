const fs = require('fs');
const input = require("./input.json");

const emojiList = input.map(emoji => ({
    emoji: emoji.emoji,
    short_names: emoji.aliases,
    category: emoji.category,
}))

const unicodeToShortcodes = {};
input.forEach(emoji => {
    unicodeToShortcodes[emoji.emoji] = emoji.aliases[0];
});

const shortcodeToUnicodes = {};
input.forEach(emoji => {
    shortcodeToUnicodes[emoji.aliases[0]] = emoji.emoji;
});

const categories = new Set();
input.forEach(emoji => {
    categories.add(emoji.category);
});

fs.rmSync("./output", {recursive: true, force: true});
fs.mkdirSync("./output")
fs.writeFileSync('./output/shortcodes-to-unicode.json', JSON.stringify(shortcodeToUnicodes, null, 2));
fs.writeFileSync('./output/unicode-to-shortcodes.json', JSON.stringify(unicodeToShortcodes, null, 2));
fs.writeFileSync('./output/emojis.json', JSON.stringify(emojiList, null, 2));
fs.writeFileSync('./output/categories.json', JSON.stringify(new Array(...categories), null, 2));