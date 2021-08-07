import {
  PropertyValue,
  RichText,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";

export const isTitlePropertyValue = (
  propValue: PropertyValue
): propValue is TitlePropertyValue => {
  return (propValue as TitlePropertyValue).type === "title";
};

export const getName = (titleList: RichText[]) => {
  return titleList.reduce((acc, cur) => {
    if (!("plain_text" in cur)) return acc;
    return (acc += cur.plain_text);
  }, "");
};

export const getPrefixNumber = (url: string) => {
  const regex = /notion\.so\/([0-9]+)-+/;
  if (!url.match(regex)) {
    console.warn(`WARN: ${url}`);
    return 0;
  }
  return Number(url.match(regex)![1]) ?? 0;
};
