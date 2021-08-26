import { Config } from "~/Config";
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
