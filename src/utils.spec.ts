import { chunk } from "./utils";

describe('chunked', () => {
  test("[1..10] -> [1..3]..", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const actual = chunk(arr, 3);
    const expected = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]];
    expected.forEach((eNumbers, eNumbersIndex) => {
      eNumbers.forEach((eNumber, eIndex) => {
        expect(actual[eNumbersIndex][eIndex]).toBe(eNumber);
      });
    });
  });
});
