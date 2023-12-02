import * as fs from "node:fs/promises";
export async function readData(file) {
  try {
    const data = await fs.readFile(file, { encoding: "utf8" });
    return data;
  } catch (err) {
    console.log(err);
  }
}

export function sumNumberArray(numArr) {
  return numArr.reduce((first, second) => {
    return first + second;
  }, 0);
}