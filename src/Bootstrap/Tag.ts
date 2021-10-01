import { Config } from "~/Config";
import { Tagger } from "~/Controller/Tagger";
import { generateTagOption } from "~/Provider/TagOptionProvider";
import {
  MarkdownRepository,
  RedisRepository,
  NotionRepository,
} from "~/Repository";

export const Tag = async () => {
  const options = generateTagOption();
  await new Tagger({
    markdownRepo: new MarkdownRepository(options.notesPath),
    redisRepo: new RedisRepository({
      showFriendlyErrorStack: Config.Redis.SHOW_FRIENDLY_ERROR_STACK,
      noDelay: Config.Redis.NO_DELAY,
      db: Config.Redis.DB,
    }),
    notionRepo: new NotionRepository(Config.Notion.KEY),
  }).run();
};
