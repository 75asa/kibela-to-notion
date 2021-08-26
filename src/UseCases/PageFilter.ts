import { Config } from "src/Config";
import { MarkdownRepository } from "src/Repository/MarkdownRepository";
import { NotionRepository } from "src/Repository/NotionRepository";
import { chunk } from "src/Utils/array";
import { isTitlePropertyValue, getPrefixNumber } from "src/Utils/notion";

export class PageFilter {
  #DATABASE = Config.Notion.DATABASE;
  #chunkedAllPrefix: number[][];
  #markdownRepo: MarkdownRepository;
  constructor(markdownRepo: MarkdownRepository) {
    this.#markdownRepo = markdownRepo;
    this.#chunkedAllPrefix = chunk(this.#markdownRepo.getAllPrefix(), 100);
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
      return this.#markdownRepo.allMetaData.some(
        item => item.prefixNumber === number
      );
    });
  }
}
