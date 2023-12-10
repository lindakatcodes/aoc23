import * as h from "../../scripts/helpers.js";
const initData = await h.readData("./src/2023/inputs/day08Input.txt");
const nodenameregex = /[A-Z]{3}/g;

// functions

// returns an object with a direction string and list of nodes array
function createNodeObj(splitinput) {
  const directions = splitinput[0];
  const nodeslist = {};

  splitinput.slice(1).forEach((pathnode) => {
    const pathdata = [...pathnode.matchAll(nodenameregex)].flat();
    const name = pathdata[0];
    const left = pathdata[1];
    const right = pathdata[2];
    nodeslist[name] = {
      left,
      right,
    };
  });
  return new Object({
    directions,
    nodeslist,
  });
}

function countSteps(stepsobj) {
  const steps = stepsobj.directions.split("");
  const startnode = "AAA";
  let stepindex = 0;
  let count = 0;
  let nextnode = "";
  let foundZ = false;

  do {
    count++;
    const dir = steps[stepindex % steps.length];
    if (stepindex === 0) {
      dir === "L"
        ? (nextnode = stepsobj.nodeslist[startnode].left)
        : (nextnode = stepsobj.nodeslist[startnode].right);
    } else {
      dir === "L"
        ? (nextnode = stepsobj.nodeslist[nextnode].left)
        : (nextnode = stepsobj.nodeslist[nextnode].right);
    }
    if (nextnode === "ZZZ") {
      foundZ = true;
      break;
    }
    stepindex++;
  } while (!foundZ);

  return count;
}

// part 1
const splitinput = initData.split("\n");
const nodes = createNodeObj(splitinput);
const steps = countSteps(nodes);
console.log({ part1: steps });

// part 2

// tests
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  const sample1 = [
    "RL",
    "AAA = (BBB, CCC)",
    "BBB = (DDD, EEE)",
    "CCC = (ZZZ, GGG)",
    "DDD = (DDD, DDD)",
    "EEE = (EEE, EEE)",
    "GGG = (GGG, GGG)",
    "ZZZ = (ZZZ, ZZZ)",
  ];

  const sample2 = [
    "LLR",
    "AAA = (BBB, BBB)",
    "BBB = (AAA, ZZZ)",
    "ZZZ = (ZZZ, ZZZ)",
  ];

  describe("part 1", () => {
    const knownSteps1 = 2;
    const knownSteps2 = 6;
    const knownsteps1obj = {
      directions: "RL",
      nodeslist: {
        AAA: {
          left: "BBB",
          right: "CCC",
        },
        BBB: {
          left: "DDD",
          right: "EEE",
        },
        CCC: {
          left: "ZZZ",
          right: "GGG",
        },
        DDD: {
          left: "DDD",
          right: "DDD",
        },
        EEE: {
          left: "EEE",
          right: "EEE",
        },
        GGG: {
          left: "GGG",
          right: "GGG",
        },
        ZZZ: {
          left: "ZZZ",
          right: "ZZZ",
        },
      },
    };
    const knownsteps2obj = {
      directions: "LLR",
      nodeslist: {
        AAA: {
          left: "BBB",
          right: "BBB",
        },
        BBB: {
          left: "AAA",
          right: "ZZZ",
        },
        ZZZ: {
          left: "ZZZ",
          right: "ZZZ",
        },
      },
    };
    let steps1obj;
    let steps2obj;

    it("correctly parses the input", () => {
      steps1obj = createNodeObj(sample1);
      steps2obj = createNodeObj(sample2);
      expect(steps1obj).toEqual(knownsteps1obj);
      expect(steps2obj).toEqual(knownsteps2obj);
    });

    it("counts the right number of steps to ZZZ", () => {
      const sample1count = countSteps(steps1obj);
      const sample2count = countSteps(steps2obj);
      expect(sample1count).toEqual(knownSteps1);
      expect(sample2count).toEqual(knownSteps2);
    });
  });
  describe("part 2", () => {
    const sample3 = [
      "LR",
      "11A = (11B, XXX)",
      "11B = (XXX, 11Z)",
      "11Z = (11B, XXX)",
      "22A = (22B, XXX)",
      "22B = (22C, 22C)",
      "22C = (22Z, 22Z)",
      "22Z = (22B, 22B)",
      "XXX = (XXX, XXX)",
    ];

    const knownCount = 6;
  });
}
