import { Config } from "~/Config";
import { AllMetaData, NotionRepository } from "~/Repository";
import { isTitlePropertyValue, getPrefixNumber, chunk } from "~/Utils";

export class PageFilter {
  #DATABASE = Config.Notion.DATABASE;
  #chunkedAllPrefix: number[][];
  #allMetaData;
  constructor(allMetaData: AllMetaData) {
    this.#allMetaData = allMetaData;
    this.#chunkedAllPrefix = chunk(
      this.#allMetaData.map(item => item.prefixNumber),
      100
    );
  }
  async invoke(notionRepo: NotionRepository) {
    const allPages = await Promise.all(
      this.#chunkedAllPrefix.map(async chunkedPrefix => {
        return await notionRepo.getAllPageFromDatabase(
          this.#DATABASE,
          chunkedPrefix
        );
      })
    );
    const allFlatPages = allPages.flat();
    return allFlatPages.filter(page => {
      const nameProp = page.properties[Config.Notion.Props.NAME];
      if (!isTitlePropertyValue(nameProp)) return false;
      const number = getPrefixNumber(page.url);
      if (!number) return false;
      return this.#allMetaData.some(item => item.prefixNumber === number);
    });
  }
}
