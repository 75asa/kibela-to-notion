import {
  MarkdownRepository,
  RedisRepository,
  NotionRepository,
  KibelaMetaData,
} from "~/Repository";
import { PageFilter, PageTag, PropStore } from "~/UseCases";

export class Tagger {
  #redisRepo: RedisRepository;
  #notionRepo: NotionRepository;
  #successCount: number;
  #allMetaData: {
    prefixNumber: number;
    meta: KibelaMetaData;
  }[];
  private constructor(args: {
    redisRepo: RedisRepository;
    notionRepo: NotionRepository;
  }) {
    const { redisRepo, notionRepo } = args;
    this.#notionRepo = notionRepo;
    this.#redisRepo = redisRepo;
    this.#allMetaData = [];
    this.#successCount = 0;
  }

  static async factory(args: {
    markdownRepo: MarkdownRepository;
    redisRepo: RedisRepository;
    notionRepo: NotionRepository;
  }) {
    const { markdownRepo, redisRepo, notionRepo } = args;
    const instance = new Tagger({
      redisRepo,
      notionRepo,
    });
    instance.#allMetaData = await markdownRepo.getAllMeta();
    return instance;
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
