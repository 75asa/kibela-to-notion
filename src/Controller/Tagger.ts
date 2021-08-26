import { Config } from "src/Config";
import { MarkdownRepository } from "src/Repository/MarkdownRepository";
import { NotionRepository } from "src/Repository/NotionRepository";
import { RedisRepository } from "src/Repository/RedisRepository";
import { PageFilter } from "src/UseCases/PageFilter";
import { PageTag } from "src/UseCases/PageTag";
import { PropStore } from "src/UseCases/PropStore";

export class Tagger {
  #markdownRepo: MarkdownRepository;
  #redisRepo: RedisRepository;
  #notionRepo: NotionRepository;
  constructor(arg: {
    markdownRepo: MarkdownRepository;
    redisRepo: RedisRepository;
    notionRepo: NotionRepository;
  }) {
    this.#notionRepo = new NotionRepository(Config.Notion.KEY);
    this.#markdownRepo = arg.markdownRepo;
    this.#redisRepo = new RedisRepository({
      showFriendlyErrorStack: Config.Redis.SHOW_FRIENDLY_ERROR_STACK,
      noDelay: Config.Redis.NO_DELAY,
    });
  }

  async run() {
    const filteredPages = await new PageFilter(this.#markdownRepo).invoke(
      this.#notionRepo
    );
    let successCount = 0;

    for await (const page of filteredPages) {
      const updatedPage = await new PageTag({
        page,
        markdownRepo: this.#markdownRepo,
        redisRepo: this.#redisRepo,
        notionRepo: this.#notionRepo,
      }).invoke();
      if (!updatedPage) continue;
      if (updatedPage) successCount++;
      new PropStore({
        propValueMap: updatedPage.properties,
        redisRepo: this.#redisRepo,
      }).invoke();
    }
    console.log({ successCount });
  }
}
