import * as h from "../../scripts/helpers.js";
const initData = await h.readData("./src/2023/inputs/day03Input.txt");
const symbolRegex = /[^\.\d]/;
const starRegex = /\*/;

// returns the input (already split into lines) split into a 2d array of characters
function createSchematicGrid(input) {
  return input.map((line) => line.split(""));
}

// returns an array of all valid part numbers as numbers, with indexes and if it touches a star
function findPartNumbers(inArr) {
  const valid = [];

  inArr.forEach((line, lineIndex) => {
    let inGroup = false;
    let isValid = false;
    let touchesStar = false;
    let starIndex = null;
    let currNum = [];
    line.forEach((char, index) => {
      const isDigit = /\d/.test(char);
      if (isDigit) {
        if (!inGroup) {
          inGroup = true;
        }
        const prevRow = inArr[lineIndex - 1];
        const nextRow = inArr[lineIndex + 1];
        // check digit's validity
        const nearby = [
          (prevRow && prevRow[index - 1]) || ".",
          (prevRow && prevRow[index]) || ".",
          (prevRow && prevRow[index + 1]) || ".",
          line[index - 1] || ".",
          line[index + 1] || ".",
          (nextRow && nextRow[index - 1]) || ".",
          (nextRow && nextRow[index]) || ".",
          (nextRow && nextRow[index + 1]) || ".",
        ].join("");
        const charIsValid = symbolRegex.test(nearby);
        if (charIsValid) {
          isValid = true;
          if (starRegex.test(nearby)) {
            touchesStar = true;
            // console.log({ nearby });
            const nearStar = nearby.split("").indexOf("*");
            // console.log({ nearStar, char });
            if ([0, 3, 5].includes(nearStar)) {
              starIndex = index - 1;
            } else if ([2, 4, 7].includes(nearStar)) {
              starIndex = index + 1;
            } else {
              starIndex = index;
            }
          }
        }
        currNum.push(char);
      }
      if ((!isDigit && inGroup) || index === line.length - 1) {
        // send result if valid
        if (isValid) {
          valid.push({
            num: Number(currNum.join("")),
            possibleGear: touchesStar,
            starpoint: starIndex,
            line: lineIndex,
          });
        }
        // reset values for next number
        inGroup = false;
        isValid = false;
        touchesStar = false;
        starIndex = null;
        currNum = [];
      }
    });
  });
  return valid;
}

// returns all gear ratios as an array
function calcGearRatios(inArr) {
  const ratios = [];

  return ratios;
}

// part 1
const parsedData = initData.split("\n");
const schematic = createSchematicGrid(parsedData);
const validParts = findPartNumbers(schematic);
const partNumbers = validParts.map((part) => part.num);
const validSum = h.sumNumberArray(partNumbers);
console.log({ part1: validSum });

// part 2
// const validGearRatios = calcGearRatios(schematic);
// const ratioSum = h.sumNumberArray(validGearRatios);
// console.log({ part2: ratioSum });

// tests
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
  let fullPartList = [];

  describe("part 1", () => {
    const knownPartNumbers = [467, 35, 633, 617, 592, 755, 664, 598];
    const knownSum = 4361;
    let partNumbers = [];
    it("gets the right part numbers", () => {
      const schematic = createSchematicGrid(sample1);
      fullPartList = findPartNumbers(schematic);
      console.log({ fullPartList });
      partNumbers = fullPartList.map((part) => part.num);
      console.log({ partNumbers });
      expect(partNumbers).toEqual(knownPartNumbers);
    });

    it("gets the right sum from the part numbers", () => {
      const sum = h.sumNumberArray(partNumbers);
      expect(sum).toEqual(knownSum);
    });

    it("catches similar numbers", () => {
      const sample1b = [
        "1-......",
        "........",
        "......-1",
        "........",
        ".24..4..",
        "......*4",
      ];
      const schematic = createSchematicGrid(sample1b);
      const partNums2 = findPartNumbers(schematic);
      const justNums = partNums2.map((part) => part.num);
      console.log({ justNums });
      expect(justNums).toEqual([1, 1, 4, 4]);
    });
  });

  describe("part 2", () => {
    const knownGearRatios = [16345, 451490];
    const knownTotal = 467835;

    it("gets the right gear numbers", () => {
      const ratios = calcGearRatios(fullPartList);
    });

    // it("gets the right sum from the gear ratios", () => {
    //   const sum = h.sumNumberArray(knownGearRatios);
    //   expect(sum).toEqual(knownTotal);
    // });
  });
}
