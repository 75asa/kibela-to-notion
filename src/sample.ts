import { parseISO8601FromKibelaFormatDate } from "./Utils";

const target_1 = "2021-01-19 16:52:34 +0900";
const target_2 = "2021-01-19 16:52:34 +0900";

const result_1 = parseISO8601FromKibelaFormatDate(target_1);
const result_2 = parseISO8601FromKibelaFormatDate(target_2);

console.log({ result_1, result_2 });
