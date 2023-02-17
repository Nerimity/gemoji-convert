const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const twemoji = require('twemoji');
const input = require("./input.json");

// console.log(twemoji)

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



// create twemoji spritesheet


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const U200D = String.fromCharCode(0x200d);
const UFE0Fg = /\uFE0F/g;

const unicodeToTwemojiUrl = (unicode) => {
  const codePoint = twemoji.convert.toCodePoint(
    unicode.indexOf(U200D) < 0 ? unicode.replace(UFE0Fg, "") : unicode
  );

return `https://nerimity.com/twemojis/${codePoint}.svg`

}


async function generateSprites() {
    const SIZE = 40;
    const ROW = 40;

    let currentColumn = 0;
    
    const canvas = createCanvas(SIZE * ROW, 1680)
    const ctx = canvas.getContext('2d')
    
    let count = 0;    
    for (let index = 0; index < emojiList.length; index++) {
        const row = index % ROW;
        const emoji = emojiList[index];
        const image = await loadImage(unicodeToTwemojiUrl(emoji.emoji)).catch(() => {
            console.log(`invalid: ${emoji.emoji} ${unicodeToTwemojiUrl(emoji.emoji)}`)
        });
        if (!image) continue;
        if (row === 0 && index !== 0) {
            currentColumn++;
        }
        ctx.drawImage(image, row * SIZE, currentColumn * SIZE , SIZE, SIZE);
        count++;
        console.log(`${count}/${emojiList.length}`);
    
    }

    const out = fs.createWriteStream(__dirname + '/test.png')
    const stream = canvas.createPNGStream({compressionLevel: 0, filters: canvas.PNG_NO_FILTERS})
    stream.pipe(out)
    out.on('finish', () =>  console.log('The PNG file was created.'))
 
}



generateSprites();

