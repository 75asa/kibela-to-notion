import {
  MarkdownRepository,
  RedisRepository,
  NotionRepository,
} from "~/Repository";
import { PageFilter, PageTag, PropStore } from "~/UseCases";

export class Tagger {
  #markdownRepo: MarkdownRepository;
  #redisRepo: RedisRepository;
  #notionRepo: NotionRepository;
  #successCount: number;
  #allMetaData;
  constructor(args: {
    markdownRepo: MarkdownRepository;
    redisRepo: RedisRepository;
    notionRepo: NotionRepository;
  }) {
    const { markdownRepo, redisRepo, notionRepo } = args;
    this.#notionRepo = notionRepo;
    this.#markdownRepo = markdownRepo;
    this.#allMetaData = this.#markdownRepo.getAllMeta();
    this.#redisRepo = redisRepo;
    this.#successCount = 0;
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
      await new PropStore({
        propValueMap: updatedPage.properties,
        redisRepo: this.#redisRepo,
      }).invoke();
    }
    console.log({ successCount: this.#successCount });
  }
}
