import * as h from "../../scripts/helpers.js";
const initData = await h.readData("./src/2023/inputs/day01Input.txt");
const calValueList = initData.split("\n");

const digits = new Map();
digits.set("one", "1");
digits.set("two", "2");
digits.set("three", "3");
digits.set("four", "4");
digits.set("five", "5");
digits.set("six", "6");
digits.set("seven", "7");
digits.set("eight", "8");
digits.set("nine", "9");

function getCalibrationValueDigits(val) {
  const allNumbers = val.match(/[0-9]/g);
  if (!allNumbers) return 0;
  const combined = allNumbers[0] + allNumbers[allNumbers.length - 1];
  return Number(combined);
}

function getCalibrationValueMixed(val) {
  const possibleDigits = /[0-9]|one|two|three|four|five|six|seven|eight|nine/g;
  const allValues = val.match(possibleDigits);

  // have to separately convert these since they could be text
  const first = digits.get(allValues[0]) || allValues[0];
  const last =
    digits.get(allValues[allValues.length - 1]) ||
    allValues[allValues.length - 1];
  const combined2 = first + last;
  return Number(combined2);
}

function getCalibrationSum(valArray) {
  return valArray.reduce((first, second) => {
    return first + second;
  }, 0);
}

// part 1
const calValues = calValueList.map((val) => getCalibrationValueDigits(val));
const calSum1 = getCalibrationSum(calValues);
console.log({ part1: calSum1 });

// part 2
const newCalValues = calValueList.map((val) => getCalibrationValueMixed(val));
const calSum2 = getCalibrationSum(newCalValues);
console.log({ part2: calSum2 });

// sample tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  describe("part 1 gathering of calibration values", () => {
    const answers = [12, 38, 15, 77];
    const trueSum = 142;
    const sample1 = ["1abc2", "pqr3stu8vwx", "a1b2c3d4e5f", "treb7uchet"];
    const testData = [];

    it("gets the right calibration values", () => {
      sample1.forEach((value) => {
        const result = getCalibrationValueDigits(value);
        testData.push(result);
      });
      expect(testData).toEqual(answers);
    });

    it("gets the right sum", () => {
      const sum = getCalibrationSum(testData);
      expect(sum).toEqual(trueSum);
    });
  });

  describe("part 2 gathering of calibration values with mixed digits", () => {
    const answers = [29, 83, 13, 24, 42, 14, 76];
    const trueSum = 281;
    const sample2 = [
      "two1nine",
      "eightwothree",
      "abcone2threexyz",
      "xtwone3four",
      "4nineeightseven2",
      "zoneight234",
      "7pqrstsixteen",
    ];
    const testData = [];

    it("gets the right calibration values", () => {
      sample2.forEach((value) => {
        const result = getCalibrationValueMixed(value);
        testData.push(result);
      });
      expect(testData).toEqual(answers);
    });

    it("gets the right sum", () => {
      const sum = getCalibrationSum(testData);
      expect(sum).toEqual(trueSum);
    });
  });
}
