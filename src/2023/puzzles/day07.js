import * as h from "../../scripts/helpers.js";
const initData = await h.readData("./src/2023/inputs/day07Input.txt");
const CARDS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const CARDSJOKER = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
];
const TYPES = ["High", "One", "Two", "Three", "Full", "Four", "Five"];

// functions
// parse a hand string into a type
function handType(hand) {
  let type = "High";
  const cardcount = h.getUniqueKeyCounts(hand.split(""));

  // start at 1 because we don't really need to loop over 'High', since that's the default case
  for (let i = 1; i < TYPES.length; i++) {
    const label = TYPES[i];

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
        if (pair.length === 1 && triple.length === 1) {
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
  return type;
}

// takes in the hand, it's current type, and how many jokers it has
// returns a new type that should be the strongest it can be updated to be
function findStrongestType(currtype, jokercount) {
  if (currtype === "Five") return currtype;

  let newtype = "";

  switch (currtype) {
    case "High": {
      // J will be 1 - will go to one
      newtype = "One";
      break;
    }
    case "One": {
      // J will be 1 or 2 - both go to three
      newtype = "Three";
      break;
    }
    case "Two": {
      // J will be 1 or 2 - 1 goes to full, 2 goes to four
      jokercount === 1 ? (newtype = "Full") : (newtype = "Four");
      break;
    }
    case "Three": {
      // J will be 1 or 3 - both will go to four
      newtype = "Four";
      break;
    }
    case "Full": {
      // J will be 2 or 3 - both will go to five
      newtype = "Five";
      break;
    }
    case "Four": {
      // J will be 1 or 4 - both will go to five
      newtype = "Five";
      break;
    }
    default:
      break;
  }

  return newtype === "" ? currtype : newtype;
}

// return an object with all the hands sorted into their respective type
// needs a boolean to determine if J are treated as wildcards or not
function sortIntoBuckets(handbids, useWildcard) {
  const handTypes = {
    High: [],
    One: [],
    Two: [],
    Three: [],
    Full: [],
    Four: [],
    Five: [],
  };

  handbids.forEach((handbid) => {
    const hand = handbid.split(" ")[0];
    let handtype = handType(hand);
    if (useWildcard) {
      const jokercount = h.getUniqueKeyCounts(hand.split(""))["J"];
      if (jokercount) {
        // figure out what the actual highest value I can get is, knowing the number of Js in the hand
        const newhandtype = findStrongestType(handtype, jokercount);
        handtype = newhandtype;
      }
    }
    handTypes[handtype].push(handbid);
  });

  return handTypes;
}

// takes a bucket object and returns the hands sorted in an array from lowest - highest
// needs a boolean to determine if J are treated as wildcards or not
function calcRanks(bucketlist, hasJokers) {
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
            const cardValueRank = !hasJokers ? CARDS : CARDSJOKER;
            const hand1val = cardValueRank.indexOf(hand1.at(matchIndex));
            const hand2val = cardValueRank.indexOf(hand2.at(matchIndex));

            return hand1val > hand2val ? -1 : 1;
          }
        });
        sortedHands.forEach((hand) => {
          const fullhand = buckethands.find((handbid) =>
            handbid.includes(hand)
          );
          innerrank.push(fullhand);
        });
        ranked.push(...innerrank);
      }
    }
  });
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
const typeBuckets = sortIntoBuckets(parsed, false);
const rankedHands = calcRanks(typeBuckets, false);
const rankedWinnings = calcWinnings(rankedHands);
console.log({ part1: rankedWinnings });

// part 2
const typeBucketsWild = sortIntoBuckets(parsed, true);
const rankedHandsWild = calcRanks(typeBucketsWild, true);
const rankedWinningsWild = calcWinnings(rankedHandsWild);
console.log({ part2: rankedWinningsWild });

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
      const sampleBuckets = sortIntoBuckets(sample, false);
      expect(sampleBuckets).toEqual(knownBuckets);
      sampleRanks = calcRanks(sampleBuckets, false);
      expect(sampleRanks).toEqual(knownRanks);
    });

    it("gets the right winnings number", () => {
      const sampleWinnings = calcWinnings(sampleRanks);
      expect(sampleWinnings).toEqual(knownWinnings);
    });
  });

  describe("part 2", () => {
    const knownBuckets2 = {
      High: [],
      One: ["32T3K 765"],
      Two: ["KK677 28"],
      Three: [],
      Full: [],
      Four: ["T55J5 684", "KTJJT 220", "QQQJA 483"],
      Five: [],
    };
    const knownRanks2 = [
      "32T3K 765",
      "KK677 28",
      "T55J5 684",
      "QQQJA 483",
      "KTJJT 220",
    ];
    const knownWinnings2 = 5905;
    let sampleRanks2;

    it("ranks the hands correctly considering wildcards", () => {
      const sampleBuckets2 = sortIntoBuckets(sample, true);
      expect(sampleBuckets2).toEqual(knownBuckets2);
      sampleRanks2 = calcRanks(sampleBuckets2, true);
      expect(sampleRanks2).toEqual(knownRanks2);
    });

    it("gets the right winnings number", () => {
      const sampleWinnings2 = calcWinnings(sampleRanks2);
      expect(sampleWinnings2).toEqual(knownWinnings2);
    });
  });
}
