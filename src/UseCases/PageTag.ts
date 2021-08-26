import { Page } from "@notionhq/client/build/src/api-types";
import { MarkdownRepository } from "src/Repository/MarkdownRepository";
import { NotionRepository } from "src/Repository/NotionRepository";
import { RedisRepository } from "src/Repository/RedisRepository";
import { PagePropGenerator } from "src/Services/PagePropGenerator";
import { getPrefixNumber } from "src/Utils/notion";

export class PageTag {
  #page: Page;
  #markdownRepo: MarkdownRepository;
  #redisRepo: RedisRepository;
  #notionRepo: NotionRepository;
  constructor(arg: {
    page: Page;
    markdownRepo: MarkdownRepository;
    redisRepo: RedisRepository;
    notionRepo: NotionRepository;
  }) {
    this.#page = arg.page;
    this.#markdownRepo = arg.markdownRepo;
    this.#redisRepo = arg.redisRepo;
    this.#notionRepo = arg.notionRepo;
  }

  async invoke() {
    const url = this.#page.url;
    const number = getPrefixNumber(url);
    const metaData = this.#markdownRepo.allMetaData.find(
      item => item.prefixNumber === number
    );
    if (!metaData) return;
    const updateProps = await new PagePropGenerator(
      metaData.meta,
      this.#redisRepo
    ).invoke();
    console.dir({ updateProps }, { depth: null });
    return await this.#notionRepo
      .updatePage(this.#page, updateProps, this.#redisRepo)
      .catch(err => {
        console.error({ err });
      });
  }
}
