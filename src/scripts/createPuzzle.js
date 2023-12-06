import { writeFile } from "fs/promises";

const day = Number(process.argv[2]);
const needsInput = Boolean(process.argv[3]) || false;

if (!day) {
  throw new Error("Day number is required to generate files.");
}

//  make the file name with the day
const paddedDay = day < 10 ? `0${day}` : day;
const dayFile = `./src/2023/puzzles/day${paddedDay}.js`;
// make an input file if needed
const inputFile = `./src/2023/inputs/day${paddedDay}Input.txt`;
// store the string I want to be written by default to the file
const template = `
  import * as h from "../../scripts/helpers.js";
  ${needsInput && `const initData = await h.readData("${inputFile}");`}

  if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest;

    const sample = [];

    describe('part 1', () => {});
    describe('part 2', () => {});
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
