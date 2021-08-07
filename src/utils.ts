import dayjs from "dayjs";

export const chunk = <T extends any[]>(targetArray: T, size: number): T[] => {
  return targetArray.reduce((accArray, _, index) => {
    return index % size
      ? accArray
      : [...accArray, targetArray.slice(index, index + size)];
  }, [] as T[][]);
};

export const parseISO8601 = (date: Date) => {
  return dayjs(date).format();
};

export const parseDate = (isoString: string) => {
  return dayjs(isoString).toDate();
};
