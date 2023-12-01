const prompt = require("prompt-sync")({ sigint: true });
const { writeFile } = require("fs/promises");

const day = Number(prompt("What day is it: "));
const needsInput = Boolean(prompt("Do you need an input file? "));

//  make the file name with the day
const paddedDay = day < 10 ? `0${day}` : day;
const dayFile = `./src/2023/puzzles/day${paddedDay}.js`;
// make an input file if needed
const inputFile = `./src/2023/inputs/day${paddedDay}Input.txt`;
// store the string I want to be written by default to the file
const template = `
  import * as h from "../../scripts/helpers";
  ${needsInput && `const initData = await h.readData("${inputFile}");`}

  if (import.meta.vitest) {
    const { it, expect } = import.meta.vitest;
  }
`;
// write the string to the file
(async () => {
  try {
    await writeFile(`${dayFile}`, template);
    if (needsInput) {
      await writeFile(inputFile, "");
    }
    // final console log and close out
    console.log(`Files for day ${paddedDay} are created! You got this!`);
  } catch (error) {
    console.error(
      `Got an error trying to write the file: ${error.message}, ${template}`
    );
  }
})();
