import { Config } from "./Config";
import { getName, getPrefixNumber, isTitlePropertyValue } from "./notion/utils";
import { NotionRepository } from "./NotionRepository";
import { getAllMetaData } from "./parser";
import { RedisRepository } from "./RedisRepository";
import { getUpdateProperties } from "./updateProp";

const chunk = <T extends any[]>(targetArray: T, size: number): T[] => {
  return targetArray.reduce((accArray, _, index) => {
    return index % size
      ? accArray
      : [...accArray, targetArray.slice(index, index + size)];
  }, [] as T[][]);
};

export const main = async () => {
  const notionRepo = new NotionRepository(Config.Notion.KEY);
  const redisRepo = new RedisRepository();
  const DATABASE = Config.Notion.DATABASE;
  const allMetaData = getAllMetaData();
  const allPrefix = allMetaData.map(item => item.prefixNumber);
  // [0..99] [100..199] ...
  const chunkedAllPrefix = chunk(allPrefix, 100);
  const allPages = await Promise.all(
    chunkedAllPrefix.map(async chunkedPrefix => {
      return await notionRepo.getAllPageFromDatabase(DATABASE, chunkedPrefix);
    })
  );
  await Promise.all(
    allPages.map(async pageMap => {
      await Promise.all(
        pageMap.map(async page => {
          const nameProp = page.properties.Name;
          if (!isTitlePropertyValue(nameProp)) return;
          const name = getName(nameProp.title);
          const url = page.url;
          console.log({ name, url });
          const no = getPrefixNumber(url);
          if (!no) return;
          const metaData = allMetaData.find(item => item.prefixNumber === no);
          if (!metaData) return;
          await notionRepo.updatePage(
            page,
            await getUpdateProperties(metaData.meta, redisRepo),
            redisRepo
          );
        })
      ).finally(() => {
        console.log("Finished updating page");
        process.exit();
      });
    })
  );
};

main();
