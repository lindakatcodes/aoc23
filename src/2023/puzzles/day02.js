import * as h from "../../scripts/helpers.js";
const initData = await h.readData("./src/2023/inputs/day02Input.txt");

// return a gameId and an array of rounds
function parseGameInfo(game) {
  const gameSplit1 = game.split(": ");
  const id = Number(gameSplit1[0].split(" ")[1]);
  const rounds = gameSplit1[1].split("; ");
  return [id, rounds];
}

// return mapped qty and color combo for a cube color
function parseCubeValues(cubeData) {
  const [qty, color] = cubeData
    .split(" ")
    .map((val, i) => (i === 0 ? Number(val) : val));
  return [qty, color];
}

// return boolean if game can be possible or not
function checkGamePossibility(rounds, knownCubes) {
  let canHappen = true;
  rounds.forEach((round) => {
    const cubes = round.split(", ");
    cubes.forEach((cube) => {
      const [qty, color] = parseCubeValues(cube);
      const knownQty = knownCubes[color];
      if (qty > knownQty) {
        canHappen = false;
        return;
      }
    });
  });

  return canHappen;
}

// returns numbers for min qty of red, green, blue cubes needed for game to happen
function getMinCubeQtys(allRounds) {
  let redMin = 0;
  let greenMin = 0;
  let blueMin = 0;

  allRounds.forEach((round) => {
    const cubes = round.split(", ");
    cubes.forEach((cube) => {
      const [qty, color] = parseCubeValues(cube);
      if (color === "red" && qty > redMin) {
        redMin = qty;
      } else if (color === "green" && qty > greenMin) {
        greenMin = qty;
      } else if (color === "blue" && qty > blueMin) {
        blueMin = qty;
      }
    });
  });

  return [redMin, greenMin, blueMin];
}

// variable setup
const parsedData = initData.split("\n");
const possibleGames = [];
const knownCubeValues = {
  red: 12,
  green: 13,
  blue: 14,
};

// part 1
parsedData.forEach((game) => {
  const [gameId, rounds] = parseGameInfo(game);
  const gameCanHappen = checkGamePossibility(rounds, knownCubeValues);
  if (gameCanHappen) {
    possibleGames.push(gameId);
  }
});

const possibleSum = h.sumNumberArray(possibleGames);
console.log({ part1: possibleSum });

// part 2
const gameSums = [];
parsedData.forEach((game) => {
  const [_, rounds] = parseGameInfo(game);
  const [redMin, greenMin, blueMin] = getMinCubeQtys(rounds);
  const minSum = redMin * greenMin * blueMin;
  gameSums.push(minSum);
});
const powerSum = h.sumNumberArray(gameSums);
console.log({ part2: powerSum });

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("part 1", () => {
    const sample1 = [
      "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
      "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
      "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
      "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
      "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green",
    ];
    const knownCubes = {
      red: 12,
      green: 13,
      blue: 14,
    };
    const truePossibles = 8;
    const possibilities = [];

    it("tests each game for if it is possible", () => {
      sample1.forEach((game) => {
        const [gameId, rounds] = parseGameInfo(game);
        const gameCanHappen = checkGamePossibility(rounds, knownCubes);
        if (gameCanHappen) {
          possibilities.push(gameId);
        }
      });
      expect(possibilities).toEqual([1, 2, 5]);
    });

    it("gets the right sum of ids", () => {
      const sum = h.sumNumberArray(possibilities);
      expect(sum).toEqual(truePossibles);
    });
  });

  describe("part 2", () => {
    const sample2 = [
      "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
      "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
      "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
      "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
      "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green",
    ];
    const trueMinSum = 2286;
    const minSums = [48, 12, 1560, 630, 36];
    const sampleSums = [];

    it("finds the min qty of each dice color per game", () => {
      sample2.forEach((game) => {
        const [_, rounds] = parseGameInfo(game);
        const [redMin, greenMin, blueMin] = getMinCubeQtys(rounds);
        const minSum = redMin * greenMin * blueMin;
        sampleSums.push(minSum);
      });
      expect(sampleSums).toEqual(minSums);
    });

    it("gets the right sum of powers", () => {
      const sum = h.sumNumberArray(sampleSums);
      expect(sum).toEqual(trueMinSum);
    });
  });
}
