import { Config } from "src/Config";
import { Tagger } from "src/Controller/Tagger";
import { generateOption } from "src/Provider/TagOptionProvider";
import { MarkdownRepository } from "src/Repository/MarkdownRepository";
import { NotionRepository } from "src/Repository/NotionRepository";
import { RedisRepository } from "src/Repository/RedisRepository";

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
