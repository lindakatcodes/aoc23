import * as h from "../../scripts/helpers.js";
const initData = await h.readData("./src/2023/inputs/day01Input.txt");

console.log(initData);

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it("test in file", () => {
    expect(1 + 2).toBe(3);
  });
}