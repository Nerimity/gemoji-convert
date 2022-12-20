const fs = require('fs');
const input = require("./input.json");


const emojiList = input.map(emoji => ({
    emoji: emoji.emoji,
    short_names: emoji.aliases,
    category: emoji.category,
}))

const shortcodesToEmojis = {};

input.forEach(emoji => {
    emoji.aliases.forEach(shortName => {
        shortcodesToEmojis[shortName] = emoji.emoji;
    });
});


fs.rmSync("./out", {recursive: true, force: true});
fs.mkdirSync("./out")
fs.writeFileSync('./out/emoji-shortcodes.json', JSON.stringify(shortcodesToEmojis, null, 2));
fs.writeFileSync('./out/emoji.json', JSON.stringify(emojiList, null, 2));
