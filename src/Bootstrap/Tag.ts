import { Config } from "~/Config";
import { Tagger } from "~/Controller/Tagger";
import { generateOption } from "~/Provider/TagOptionProvider";
import { MarkdownRepository } from "~/Repository/MarkdownRepository";
import { NotionRepository } from "~/Repository/NotionRepository";
import { RedisRepository } from "~/Repository/RedisRepository";

export const tag = async () => {
  const options = generateOption();
  await new Tagger({
    markdownRepo: new MarkdownRepository(options.notesPath),
    redisRepo: new RedisRepository({
      showFriendlyErrorStack: Config.Redis.SHOW_FRIENDLY_ERROR_STACK,
      noDelay: Config.Redis.NO_DELAY,
    }),
    notionRepo: new NotionRepository(Config.Notion.KEY),
  }).run();
};
