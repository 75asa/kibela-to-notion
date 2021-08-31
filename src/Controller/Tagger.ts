import { MarkdownRepository } from "~/Repository/MarkdownRepository";
import { NotionRepository } from "~/Repository/NotionRepository";
import { RedisRepository } from "~/Repository/RedisRepository";
import { PageFilter } from "~/UseCases/PageFilter";
import { PageTag } from "~/UseCases/PageTag";
import { PropStore } from "~/UseCases/PropStore";

export class Tagger {
  #markdownRepo: MarkdownRepository;
  #redisRepo: RedisRepository;
  #notionRepo: NotionRepository;
  #successCount = 0;
  #allMetaData;
  constructor(arg: {
    markdownRepo: MarkdownRepository;
    redisRepo: RedisRepository;
    notionRepo: NotionRepository;
  }) {
    const { markdownRepo, redisRepo, notionRepo } = arg;
    this.#notionRepo = notionRepo;
    this.#markdownRepo = markdownRepo;
    this.#allMetaData = this.#markdownRepo.getAllMeta();
    this.#redisRepo = redisRepo;
  }

  async run() {
    const filteredPages = await new PageFilter(this.#allMetaData).invoke(
      this.#notionRepo
    );

    for await (const page of filteredPages) {
      const updatedPage = await new PageTag({
        page,
        allMetaData: this.#allMetaData,
        redisRepo: this.#redisRepo,
        notionRepo: this.#notionRepo,
      }).invoke();
      if (!updatedPage) continue;
      if (updatedPage) this.#successCount++;
      new PropStore({
        propValueMap: updatedPage.properties,
        redisRepo: this.#redisRepo,
      }).invoke();
    }
    console.log({ successCount: this.#successCount });
  }
}
