import {
  PropertyValue,
  RichText,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";
import { Config } from "./Config";
import { NotionRepository } from "./NotionRepository";
import { getAllMetaData } from "./parser";
import { getUpdateProperties } from "./updateProp";

const isTitlePropertyValue = (
  propValue: PropertyValue
): propValue is TitlePropertyValue => {
  return (propValue as TitlePropertyValue).type === "title";
};

const getName = (titleList: RichText[]) => {
  return titleList.reduce((acc, cur) => {
    if (!("plain_text" in cur)) return acc;
    return (acc += cur.plain_text);
  }, "");
};

const getPrefixNumber = (url: string) => {
  // https://www.notion.so/3590-_2019_05_09_kitagawa-1aaa4a1d50a0454d9669c6d8df95d591
  const regex = /notion\.so\/([0-9]+)-+/;
  if (!url.match(regex)) {
    console.warn(`WARN: ${url}`);
    return 0;
  }
  return Number(url.match(regex)![1]) ?? 0;
};

const main = async () => {
  const notionRepo = new NotionRepository(Config.Notion.KEY);
  const DATABASE = Config.Notion.DATABASE;
  // TODO: ディレクトリをスキャン;
  const allMeta = getAllMetaData();
  const allPages = await notionRepo.getAllPageFromDatabase(DATABASE);

  await Promise.all(
    allPages.map(async page => {
      const nameProp = page.properties.Name;
      if (!isTitlePropertyValue(nameProp)) return;
      const name = getName(nameProp.title);
      const url = page.url;
      console.log({ name, url });
      const no = getPrefixNumber(url);
      if (!no) return;
      if (!allMeta.has(no)) return;
      const meta = allMeta.get(no);
      if (!meta) return;
      await notionRepo.updatePage(page, getUpdateProperties(meta));
    })
  );
};

main();
