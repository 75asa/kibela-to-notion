import { Page } from "@notionhq/client/build/src/api-types";
import { RedisRepository, NotionRepository, AllMetaData } from "~/Repository";
import { PagePropGenerator } from "~/Services/PagePropGenerator";
import { getPrefixNumber } from "~/Utils";

interface PageTagArgs {
  page: Page;
  allMetaData: AllMetaData;
  redisRepo: RedisRepository;
  notionRepo: NotionRepository;
}
export class PageTag {
  #page: Page;
  #redisRepo: RedisRepository;
  #notionRepo: NotionRepository;
  #allMetaData;
  constructor({ page, allMetaData, redisRepo, notionRepo }: PageTagArgs) {
    this.#page = page;
    this.#allMetaData = allMetaData;
    this.#redisRepo = redisRepo;
    this.#notionRepo = notionRepo;
  }

  async invoke() {
    const url = this.#page.url;
    const number = getPrefixNumber(url);
    const metaData = this.#allMetaData.find(
      item => item.prefixNumber === number
    );
    if (!metaData) return;
    const updateProps = await new PagePropGenerator(
      metaData.meta,
      this.#redisRepo
    ).invoke();
    // console.dir({ updateProps }, { depth: null });
    return await this.#notionRepo
      .updatePage(this.#page, updateProps, this.#redisRepo)
      .catch(err => {
        console.error({ err });
      });
  }
}
