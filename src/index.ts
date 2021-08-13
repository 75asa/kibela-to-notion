import { Config } from "./Config";
import {
  getName,
  getPrefixNumber,
  isTitlePropertyValue,
} from "./notionHelpers";
import { NotionRepository } from "./repository/NotionRepository";
import { getAllMetaData } from "./metaParser";
import { RedisRepository } from "./repository/RedisRepository";
import { getUpdateProperties } from "./updateProp";
import { chunk } from "./utils";

export const main = async () => {
  const notionRepo = new NotionRepository(Config.Notion.KEY);
  const redisRepo = new RedisRepository({
    showFriendlyErrorStack: Config.Redis.SHOW_FRIENDLY_ERROR_STACK,
    noDelay: Config.Redis.NO_DELAY,
  });
  const DATABASE = Config.Notion.DATABASE;
  const allMetaData = getAllMetaData();
  const allPrefix = allMetaData.map(item => item.prefixNumber);
  const chunkedAllPrefix = chunk(allPrefix, 100);
  const allPages = await Promise.all(
    chunkedAllPrefix.map(async chunkedPrefix => {
      return await notionRepo.getAllPageFromDatabase(DATABASE, chunkedPrefix);
    })
  );
  let successCount = 0;
  await Promise.all(
    allPages.map(async pageMap => {
      return await Promise.all(
        pageMap.map(async page => {
          const nameProp = page.properties.Name;
          if (!isTitlePropertyValue(nameProp)) return;
          const name = getName(nameProp.title);
          const url = page.url;
          const no = getPrefixNumber(url);
          if (!no) return;
          const metaData = allMetaData.find(item => item.prefixNumber === no);
          if (!metaData) return;
          const updateProps = await getUpdateProperties(
            metaData.meta,
            redisRepo
          );
          console.dir({ updateProps }, { depth: null });
          await notionRepo
            .updatePage(page, updateProps, redisRepo)
            .finally(() => {
              successCount++;
              console.log("Page updated", { name, url });
            });
        })
      );
    })
  ).finally(() => {
    console.log(
      `Finished updating page.\ntotal success count is ${successCount}!!`
    );
    process.exit();
  });
};

main();
