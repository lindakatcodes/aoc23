import * as h from "../../scripts/helpers.js";
const initData = await h.readData("./src/2023/inputs/day07Input.txt");
const CARDS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const TYPES = ["High", "One", "Two", "Three", "Full", "Four", "Five"];
// [23456789TJQKA]

// functions
// parse a hand string into a type
function handType(hand) {
  let type = "";
  const cardcount = h.getUniqueKeyCounts(hand.split(""));
  // console.log({ cardcount });

  for (let i = 0; i < TYPES.length; i++) {
    const label = TYPES[i];
    // console.log({ label });

    switch (label) {
      case "One": {
        const pair = Object.values(cardcount).filter((count) => count === 2);
        if (pair.length === 1) {
          type = "One";
        }
        break;
      }
      case "Two": {
        const pair = Object.values(cardcount).filter((count) => count === 2);
        if (pair.length === 2) {
          type = "Two";
        }
        break;
      }
      case "Three": {
        const triplet = Object.values(cardcount).filter((count) => count === 3);
        if (triplet.length === 1) {
          type = "Three";
        }
        break;
      }
      case "Full": {
        const pair = Object.values(cardcount).filter((count) => count === 2);
        const triple = Object.values(cardcount).filter((count) => count === 3);
        if (pair.length === 1 && triple.length === 3) {
          type = "Full";
        }
        break;
      }
      case "Four": {
        const four = Object.values(cardcount).filter((count) => count === 4);
        if (four.length === 1) {
          type = "Four";
        }
        break;
      }
      case "Five": {
        const all = Object.values(cardcount).filter((count) => count === 5);
        if (all.length === 1) {
          type = "Five";
        }
        break;
      }
      default:
        type = "High";
    }
  }
  // console.log({ type });
  return type;
}

// return an object with all the hands sorted into their respective type
function sortIntoBuckets(handbid) {
  const handTypes = {
    High: [],
    One: [],
    Two: [],
    Three: [],
    Full: [],
    Four: [],
    Five: [],
  };

  handbid.forEach((handbid) => {
    const hand = handbid.split(" ")[0];
    const handtype = handType(hand);
    handTypes[handtype].push(handbid);
  });

  return handTypes;
}

// takes a bucket object and returns the hands sorted in an array from lowest - highest
function calcRanks(bucketlist) {
  const bucketkeys = Object.keys(bucketlist);
  const ranked = [];

  bucketkeys.forEach((key) => {
    const buckethands = bucketlist[key];
    if (buckethands.length) {
      if (buckethands.length === 1) {
        ranked.push(buckethands[0]);
      } else {
        const innerrank = [];
        const hands = buckethands.map((handbid) => handbid.split(" ")[0]);
        const sortedHands = hands.sort((hand1, hand2) => {
          let matchIndex;
          for (let i = 0; i < 5; i++) {
            const canMatch = hand1.at(i) !== hand2.at(i);
            if (canMatch) {
              matchIndex = i;
              break;
            }
          }
          if (matchIndex === undefined) {
            return 0;
          } else {
            const hand1val = CARDS.indexOf(hand1.at(matchIndex));
            const hand2val = CARDS.indexOf(hand2.at(matchIndex));

            return hand1val > hand2val ? -1 : 1;
          }
        });
        // console.log({ sortedHands });
        hands.forEach((hand) => {
          const fullhand = buckethands.find((handbid) =>
            handbid.includes(hand)
          );
          // console.log({ fullhand });
          innerrank.push(fullhand);
        });
        // console.log({ innerrank });
        ranked.push(...innerrank);
      }
    }
  });
  // console.log({ ranked });
  return ranked;
}

// takes a rank array and returns a number - each hand's bid * it's rank (index + 1)
function calcWinnings(sortedarr) {
  return sortedarr.reduce((acc, curr, idx) => {
    const bid = curr.split(" ")[1];
    const amt = bid * (idx + 1);
    return acc + amt;
  }, 0);
}

// part 1
const parsed = initData.split("\n");
const typeBuckets = sortIntoBuckets(parsed);
const rankedHands = calcRanks(typeBuckets);
const rankedWinnings = calcWinnings(rankedHands);
console.log({ part1: rankedWinnings });
// part 1 answer is too high; likely need to double check some of the sorting since I'm sure I didn't account fully for matches and longer arrays 249979530

// part 2

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  const sample = [
    "32T3K 765",
    "T55J5 684",
    "KK677 28",
    "KTJJT 220",
    "QQQJA 483",
  ];

  describe("part 1", () => {
    const knownBuckets = {
      High: [],
      One: ["32T3K 765"],
      Two: ["KK677 28", "KTJJT 220"],
      Three: ["T55J5 684", "QQQJA 483"],
      Full: [],
      Four: [],
      Five: [],
    };
    const knownRanks = [
      "32T3K 765",
      "KTJJT 220",
      "KK677 28",
      "T55J5 684",
      "QQQJA 483",
    ];
    const knownWinnings = 6440;
    let sampleRanks;

    it("ranks the hands in the proper order", () => {
      const sampleBuckets = sortIntoBuckets(sample);
      // console.log({ sampleBuckets });
      expect(sampleBuckets).toEqual(knownBuckets);
      sampleRanks = calcRanks(sampleBuckets);
      // console.log({ sampleRanks });
      expect(sampleRanks).toEqual(knownRanks);
    });

    it("gets the right winnings number", () => {
      const sampleWinnings = calcWinnings(sampleRanks);
      // console.log({ sampleWinnings });
      expect(sampleWinnings).toEqual(knownWinnings);
    });
  });
  // describe('part 2', () => {});
}
