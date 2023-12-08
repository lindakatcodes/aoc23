import * as fs from "node:fs/promises";

// returns the puzzle input
export async function readData(file) {
  try {
    const data = await fs.readFile(file, { encoding: "utf8" });
    return data;
  } catch (err) {
    console.log(err);
  }
}

// returns a sum from an array of numbers
export function sumNumberArray(numArr) {
  return numArr.reduce((first, second) => {
    return first + second;
  }, 0);
}

// returns an object that has a property for each key, set to the startVal
export function createCountObject(keys, startVal) {
  const countObj = new Object();
  for (let i = 0; i < keys.length; i++) {
    countObj[keys[i]] = startVal;
  }
  return countObj;
}

// returns an object containing the number of occurances of each unique key
export function getUniqueKeyCounts(keys) {
  return keys.reduce((allKeys, key) => {
    if (key in allKeys) {
      allKeys[key]++;
    } else {
      allKeys[key] = 1;
    }
    return allKeys;
  }, {});
}
