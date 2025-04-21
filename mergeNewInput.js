const fs = require('fs');
const oldInputPath = "input.json";
const newInputPath = "newInput.json";
const outPath = "mergedOutput.json";


const filterUnicode= ["🇮🇱"] // Free Palestine



const main = () => {
  const input = JSON.parse(fs.readFileSync(oldInputPath, 'utf8'));
  const newInput = JSON.parse(fs.readFileSync(newInputPath, 'utf8'));


  for (let i = 0; i < newInput.length; i++) {
    const newEmoji = newInput[i];
    if (filterUnicode.includes(newEmoji.emoji)) {
      newInput.splice(i, 1);
      continue;
    };
    const oldEmoji = input.find(emoji => emoji.emoji === newEmoji.emoji);
    if (!oldEmoji) {
      console.log(`New emoji: ${newEmoji.aliases}`);
      continue;
    }
    const oldAliases = oldEmoji.aliases;

    newEmoji.aliases = [...new Set([...oldAliases, ...newEmoji.aliases])];
  }

  fs.writeFileSync(outPath, JSON.stringify(newInput, null, 2));
  console.log(`\nMerged input saved to ${outPath}`);
}

main();