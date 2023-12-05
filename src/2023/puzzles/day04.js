import * as h from "../../scripts/helpers.js";
const initData = await h.readData("./src/2023/inputs/day04Input.txt");

// functions
function findWinningMatches(card) {
  const [_, values] = card.split(": ");
  const [list1, list2] = values.split(" | ");
  const winners = list1
    .split(" ")
    .filter((val) => val !== "")
    .map((val) => Number(val));
  const actual = list2
    .split(" ")
    .filter((val) => val !== "")
    .map((val) => Number(val));

  const matches = [];
  actual.forEach((val) => winners.includes(val) && matches.push(val));
  return matches;
}

function calcMatchesTotal(matchArray) {
  const total = matchArray.reduce((acc, _, idx) => {
    if (idx === 0) {
      return 1;
    } else {
      return acc * 2;
    }
  }, 0);
  return total;
}

// return object with counts for cards
function countCardTotals(cardlist) {
  const totalInitCards = cardlist.length;
  const cardKeysArray = Array.from(Array(totalInitCards).keys()).map(
    (spot) => spot + 1
  );
  const countList = h.createCountObject(cardKeysArray, 1);

  cardlist.forEach((card, index) => {
    const name = index + 1;
    const matches = card.length;
    const rounds = countList[name];

    for (let a = 0; a < rounds; a++) {
      for (let i = 0; i < matches; i++) {
        const nextCard = name + i + 1;
        countList[nextCard] += 1;
      }
    }
  });

  return countList;
}

function calcCardCount(totalObj) {
  const allValues = Object.values(totalObj);
  const cardCount = allValues.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  return cardCount;
}

// part 1
const allCards = initData.split("\n");
const cardWinnings = allCards.map((card) => findWinningMatches(card));
const cardValues = cardWinnings.map((matchset) => calcMatchesTotal(matchset));
const cardTotal = h.sumNumberArray(cardValues);
console.log({ part1: cardTotal });

// part 2
const cardCounts = countCardTotals(cardWinnings);
// console.log({ cardCounts });
const totalCardCount = calcCardCount(cardCounts);
console.log({ part2: totalCardCount });
// 3124145 is too low; guessing maybe the count of cards isn't right, or my for loops aren't counting through all the actual cards

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  const sample = [
    "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53",
    "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19",
    "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1",
    "Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83",
    "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36",
    "Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
  ];

  describe("part 1", () => {
    const knownCardValues = [8, 2, 2, 1, 0, 0];
    const knownTotal = 13;
    const cardValues = [];

    it("counts the right card values", () => {
      sample.forEach((card) => {
        const matches = findWinningMatches(card);
        const value = calcMatchesTotal(matches);
        cardValues.push(value);
      });
      // console.log({ cardValues });
      expect(cardValues).toEqual(knownCardValues);
    });

    it("gets the right sum", () => {
      const sampleTotal = h.sumNumberArray(cardValues);
      expect(sampleTotal).toEqual(knownTotal);
    });
  });

  describe("part 2", () => {
    const knownCardCounts = {
      1: 1,
      2: 2,
      3: 4,
      4: 8,
      5: 14,
      6: 1,
    };
    const knownTotalCards = 30;
    let sampleCardCounts;

    it("counts the right number of cards", () => {
      const sampleWinnings = sample.map((card) => findWinningMatches(card));
      sampleCardCounts = countCardTotals(sampleWinnings);
      expect(sampleCardCounts).toEqual(knownCardCounts);
    });

    it("gets the right total count", () => {
      const sampleTotal = calcCardCount(sampleCardCounts);
      expect(sampleTotal).toEqual(knownTotalCards);
    });
  });
}
