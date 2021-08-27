import {
  PropertyValue,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";

export const isTitlePropertyValue = (
  propValue: PropertyValue
): propValue is TitlePropertyValue => {
  return (propValue as TitlePropertyValue).type === "title";
};

export const getPrefixNumber = (url: string) => {
  const regex = /notion\.so\/([0-9]+)-+/;
  if (!url.match(regex)) {
    console.warn(`WARN: ${url}`);
    return 0;
  }
  return Number(url.match(regex)![1]) ?? 0;
};
