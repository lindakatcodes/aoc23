import * as h from "../../scripts/helpers.js";
const initData = ["Time: 44 82 69 81", "Distance: 202 1076 1138 1458"];
// const initData = ["Time: 7 15 30", "Distance: 9 40 200"];

// functions
// parse the input to return the time / distance as an array of array pairs if no kerning (p1) and the single array pair of time/dist if there is kerning (p2)
function getRaceRecords(input, kerning = false) {
  let parsedData;
  if (!kerning) {
    const [times, distances] = input.map((row) =>
      row
        .split(" ")
        .slice(1)
        .map((val) => Number(val))
    );
    parsedData = times.map((time, index) => [time, distances[index]]);
  } else {
    const [time, distance] = input.map((row) =>
      row.split(" ").slice(1).join("")
    );
    parsedData = [[Number(time), Number(distance)]];
  }
  return parsedData;
}

// find the number of ways you can beat the record for each race
function calcWinRanges(races) {
  // races in an array of arrays, where the time is 0 and record is 1
  const wins = [];

  races.forEach((race) => {
    const racetime = race[0];
    const record = race[1];
    const fasterDists = [];
    let inRange = false;

    for (let m = 1; m < racetime; m++) {
      const dist = (racetime - m) * m;
      if (dist > record) {
        fasterDists.push(m);
        inRange = true;
      } else if (dist < record && inRange) {
        inRange = false;
        break;
      }
    }
    wins.push(fasterDists.length);
  });

  return wins;
}

// return the wins mutliplied together
function calcMargin(wins) {
  return wins.reduce((acc, val) => {
    return acc * val;
  }, 1);
}

// part 1
const parsedRaces = getRaceRecords(initData);
const raceWins = calcWinRanges(parsedRaces);
const margin = calcMargin(raceWins);
console.log({ part1: margin });
// part 2
const monsterRace = getRaceRecords(initData, true);
const raceWinCount = calcWinRanges(monsterRace);
console.log({ part2: raceWinCount[0] });

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  const sample = ["Time: 7 15 30", "Distance: 9 40 200"];
  let parsedSample;

  describe("part 1", () => {
    const knownWinCounts = [4, 8, 9];
    const knownMargin = 288;
    const knownParsedSample = [
      [7, 9],
      [15, 40],
      [30, 200],
    ];
    let sampleWins;

    it("correctly parses the input", () => {
      parsedSample = getRaceRecords(sample);
      expect(parsedSample).toEqual(knownParsedSample);
    });

    it("gets the win counts for each race", () => {
      sampleWins = calcWinRanges(parsedSample);
      expect(sampleWins).toEqual(knownWinCounts);
    });

    it("gets the right margin", () => {
      const margin = calcMargin(sampleWins);
      expect(margin).toEqual(knownMargin);
    });
  });

  describe("part 2", () => {
    const knownParsedSample = [[71530, 940200]];
    const knownWins = 71503;
    let parsedSample2;

    it("correctly parses the input", () => {
      parsedSample2 = getRaceRecords(sample, true);
      expect(parsedSample2).toEqual(knownParsedSample);
    });

    it("gets the win counts for each race", () => {
      const sampleWins2 = calcWinRanges(parsedSample2);
      expect(sampleWins2[0]).toEqual(knownWins);
    });
  });
}
