const fs = require('fs');
const input = require("./input.json");

// emojis that dont exist or are causing problems
const blacklist = ["👁️‍🗨️"];

const emojiList = input
    .filter(emoji => !blacklist.includes(emoji.emoji))
    .map(emoji => ({
        emoji: emoji.emoji,
        short_names: emoji.aliases,
        category: emoji.category,
    }))

const unicodeToShortcodes = {};
emojiList.forEach(emoji => {
    unicodeToShortcodes[emoji.emoji] = emoji.short_names[0];
});

const shortcodeToUnicodes = {};
emojiList.forEach(emoji => {
    emoji.short_names.forEach(shortname => shortcodeToUnicodes[shortname] = emoji.emoji)
});

const categories = new Set();
emojiList.forEach(emoji => {
    categories.add(emoji.category);
});

fs.rmSync("./output", {recursive: true, force: true});
fs.mkdirSync("./output")
fs.writeFileSync('./output/shortcodes-to-unicode.json', JSON.stringify(shortcodeToUnicodes, null, 2));
fs.writeFileSync('./output/unicode-to-shortcodes.json', JSON.stringify(unicodeToShortcodes, null, 2));
fs.writeFileSync('./output/emojis.json', JSON.stringify(emojiList, null, 2));
fs.writeFileSync('./output/categories.json', JSON.stringify(new Array(...categories), null, 2));
