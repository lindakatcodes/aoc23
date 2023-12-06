import * as h from "../../scripts/helpers.js";
const initData = await h.readData("./src/2023/inputs/day05Input.txt");

// functions
// values | range
function generateSeedsObj(seedStr, type) {
  // setup the seed objects
  let seedNums = [];
  if (type === "values") {
    seedNums = seedStr.split(" ").map((val) => Number(val));
  }
  if (type === "range") {
    const seedRanges = [];
    const ranges = seedStr.split(" ").map((val) => Number(val));
    for (let i = 0; i < ranges.length; i += 2) {
      const startNum = ranges[i];
      const len = ranges[i + 1];
      for (let a = startNum; a < startNum + len; a++) {
        seedRanges.push(a);
      }
    }
    seedNums = seedRanges;
  }
  // console.log({ seedNums });

  const seeds = {};
  seedNums.forEach((seed) => {
    const setup = {
      seed,
      soil: 0,
      fertilizer: 0,
      water: 0,
      light: 0,
      temperature: 0,
      humidity: 0,
      location: 0,
    };
    seeds[seed] = setup;
  });
  return seeds;
}

function parseSeedInfo(input, seedType) {
  const seedStr = input[0].split(": ")[1];
  const seeds = generateSeedsObj(seedStr, seedType);
  const seedsKeys = Object.keys(seeds);

  // get indexes for every "map:"
  const mapIdxs = [];
  input.forEach((row, idx) => {
    if (row.split(" ").includes("map:")) {
      mapIdxs.push(idx);
    }
  });

  // parse the maps
  for (let i = 0; i < mapIdxs.length; i++) {
    const srcName = input[mapIdxs[i]].split("-")[0];
    const destName = input[mapIdxs[i]].split("-")[2].split(" ")[0];
    const start = mapIdxs[i] + 1;
    const end = mapIdxs[i + 1] || input.length;
    // looping through the ranges for this src-dest combo
    for (let j = start; j < end; j++) {
      const map = input[j].split(" ").map((val) => Number(val));
      seedsKeys.forEach((seed) => {
        const src = seeds[seed][srcName];
        const min = map[1];
        const max = map[1] + (map[2] - 1);
        if (min <= src && src <= max) {
          // console.log(`${src} is in the range ${min} - ${max}`);
          const inc = src - map[1];
          seeds[seed][destName] = map[0] + inc;
        }
      });
    }
    // any fields that are still 0 weren't set by any of the maps, and should be updated to equal the same number as the seed
    // have to run this here, after each set of ranges for the current src and dest combo. otherwise the other fields don't update from the right number and it all gets off track.
    Object.entries(seeds).forEach(([key, val]) => {
      if (val[destName] === 0) {
        seeds[key][destName] = seeds[key][srcName];
      }
    });
  }

  // console.log({ seeds });
  return seeds;
}

function findLowestLocation(seedObj) {
  let lowest = 0;

  Object.entries(seedObj).forEach(([_, fields]) => {
    if (lowest === 0) {
      lowest = fields["location"];
    } else if (fields["location"] < lowest) {
      lowest = fields["location"];
    }
  });

  return lowest;
}

// part1
const parsedData = initData.split("\n").filter((row) => row !== "");
const seedData = parseSeedInfo(parsedData, "values");
// console.log({ seedData });
const locationLow = findLowestLocation(seedData);
console.log({ part1: locationLow });

// part 2
const fullSeedData = parseSeedInfo(parsedData, "range");
const fullLocationLow = findLowestLocation(fullSeedData);
console.log({ part2: fullLocationLow });

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  const sample = [
    "seeds: 79 14 55 13",
    "seed-to-soil map:",
    "50 98 2",
    "52 50 48",
    "soil-to-fertilizer map:",
    "0 15 37",
    "37 52 2",
    "39 0 15",
    "fertilizer-to-water map:",
    "49 53 8",
    "0 11 42",
    "42 0 7",
    "57 7 4",
    "water-to-light map:",
    "88 18 7",
    "18 25 70",
    "light-to-temperature map:",
    "45 77 23",
    "81 45 19",
    "68 64 13",
    "temperature-to-humidity map:",
    "0 69 1",
    "1 0 69",
    "humidity-to-location map:",
    "60 56 37",
    "56 93 4",
  ];
  let seedInfo;

  describe("part 1", () => {
    const knownSeedInfo = {
      79: {
        seed: 79,
        soil: 81,
        fertilizer: 81,
        water: 81,
        light: 74,
        temperature: 78,
        humidity: 78,
        location: 82,
      },
      14: {
        seed: 14,
        soil: 14,
        fertilizer: 53,
        water: 49,
        light: 42,
        temperature: 42,
        humidity: 43,
        location: 43,
      },
      55: {
        seed: 55,
        soil: 57,
        fertilizer: 57,
        water: 53,
        light: 46,
        temperature: 82,
        humidity: 82,
        location: 86,
      },
      13: {
        seed: 13,
        soil: 13,
        fertilizer: 52,
        water: 41,
        light: 34,
        temperature: 34,
        humidity: 35,
        location: 35,
      },
    };
    const knownLowest = 35;
    it("gets the correct seed info counting the seeds as values", () => {
      seedInfo = parseSeedInfo(sample, "values");
      expect(seedInfo).toEqual(knownSeedInfo);
      const lowest = findLowestLocation(seedInfo);
      expect(lowest).toEqual(knownLowest);
    });
  });
  describe("part 2", () => {
    const eightytwo = {
      seed: 82,
      soil: 84,
      fertilizer: 84,
      water: 84,
      light: 77,
      temperature: 45,
      humidity: 46,
      location: 46,
    };
    const knownLowest2 = 46;

    it("gets the correct seed info counting the seeds as a range", () => {
      seedInfo = parseSeedInfo(sample, "range");
      expect(Object.keys(seedInfo)).toHaveLength(27);
      expect(seedInfo[82]).toEqual(eightytwo);
      const lowest2 = findLowestLocation(seedInfo);
      expect(lowest2).toEqual(knownLowest2);
    });
  });
}
