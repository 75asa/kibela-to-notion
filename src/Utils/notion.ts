import { PropertyValue } from "@notionhq/client/build/src/api-types";

export const isDetectiveType = <T extends PropertyValue>(
  propValue: PropertyValue
): propValue is T => {
  const propertyType = (propValue as T).type;
  return (propValue as T).type === propertyType;
};

export const getPrefixNumber = (url: string) => {
  const regex = /notion\.so\/([0-9]+)-+/;
  if (!url.match(regex)) {
    console.warn(`WARN: ${url}`);
    return 0;
  }
  return Number(url.match(regex)![1]) ?? 0;
};
