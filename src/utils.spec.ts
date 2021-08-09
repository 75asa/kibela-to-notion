import { chunk } from "./utils";

describe("chunked", () => {
  test("[1..10] -> [1..3]..", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const actual = chunk(arr, 3);
    const expected = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]];
    let index = 0;
    test.each(actual)(
      "all chunked elements is separated to a array include under 3 elements",
      (chunk1st, chunk2nd, chunk3rd) => {
        expected[index].forEach((element, index) => {
          element[index]
          index++;
        });
        index++;
        expect(chunk).toEqual(expected.shift());
      }
    );
  });
});
