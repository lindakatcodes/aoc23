import * as h from "../../scripts/helpers.js";
const initData = await h.readData("./src/2023/inputs/day03Input.txt");
const parsedData = initData.split("\n");
const symbols = "*/%-=@#+$&";
const regex = /\D/g;

function getLineNumbers(line, prevLine, nextLine) {
  const validNumbers = [];
  const possibleNumbers = line.split(regex).filter((spot) => spot !== "");
  // console.log({ possibleNumbers });
  let numStart = 0;
  let numEnd = 0;
  possibleNumbers.forEach((num) => {
    const numLen = num.length;
    numStart =
      line.indexOf(num, numStart) === 0 ? 0 : line.indexOf(num, numStart);
    numEnd =
      numStart + numLen - 1 > line.length - 1
        ? line.length - 1
        : numStart + numLen - 1;

    // adjustments to account for before and after the actual number (diagonal)
    if (numStart !== 0) {
      numStart = numStart - 1;
    }
    if (numEnd !== line.length - 1) {
      numEnd = numEnd + 1;
    }
    // console.log({ numLen, numStart, numEnd, num });

    let symbolFound = false;
    const prevSeg =
      (prevLine !== null &&
        prevLine
          .slice(numStart, numEnd + 1)
          .split(".")
          .filter((spot) => spot !== "")) ||
      [];
    const nextSeg =
      (nextLine !== null &&
        nextLine
          .slice(numStart, numEnd + 1)
          .split(".")
          .filter((spot) => spot !== "")) ||
      [];
    const sameSeg = [line.charAt(numStart), line.charAt(numEnd)]
      .filter((spot) => spot !== ".")
      .filter((spot) => spot !== "")
      .filter((spot) => symbols.includes(spot));
    // console.log({ prevSeg, nextSeg, sameSeg });
    if (prevSeg.length || nextSeg.length || sameSeg.length) {
      validNumbers.push(Number(num));
    }
  });
  // console.log({ validNumbers });
  return validNumbers;
}

// part 1
const partNumbers1 = [];
parsedData.map((line, index) => {
  const prevLine = parsedData[index - 1] || null;
  const nextLine = parsedData[index + 1] || null;
  const lineNumbers = getLineNumbers(line, prevLine, nextLine);
  lineNumbers.forEach((num) => partNumbers1.push(num));
});
const partNumSum = h.sumNumberArray(partNumbers1);
console.log({ part1: partNumSum });
// part 2

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  const sample1 = [
    "467..114..",
    "...*......",
    "..35..633.",
    "......#...",
    "617*......",
    ".....+.58.",
    "..592.....",
    "......755.",
    "...$.*....",
    ".664.598..",
  ];

  const knownPartNumbers = [467, 35, 633, 617, 592, 755, 664, 598];
  const knownSum = 4361;
  const partNumbers = [];

  describe("part 1", () => {
    it("gets the right part numbers", () => {
      sample1.map((line, index) => {
        const prevLine = sample1[index - 1] || null;
        const nextLine = sample1[index + 1] || null;
        const lineNumbers = getLineNumbers(line, prevLine, nextLine);
        lineNumbers.forEach((num) => partNumbers.push(num));
      });
      expect(partNumbers).toEqual(knownPartNumbers);
    });

    it("gets the right sum from the part numbers", () => {
      const sum = h.sumNumberArray(partNumbers);
      expect(sum).toEqual(knownSum);
    });
  });
}
