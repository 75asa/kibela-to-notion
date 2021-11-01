import { Config } from "~/Config";
import { Tagger } from "~/Controller/Tagger";
import { generateTagOption } from "~/Provider/TagOptionProvider";
import {
  MarkdownRepository,
  RedisRepository,
  NotionRepository,
} from "~/Repository";

const { SHOW_FRIENDLY_ERROR_STACK, NO_DELAY, DB } = Config.Redis;

export const Tag = async () => {
  const options = generateTagOption();
  const allResult = await Promise.all(
    options.map(async option => {
      const { notesPath } = option;
      return await new Tagger({
        markdownRepo: new MarkdownRepository({ notesPath }),
        redisRepo: new RedisRepository({
          showFriendlyErrorStack: SHOW_FRIENDLY_ERROR_STACK,
          noDelay: NO_DELAY,
          db: DB.TAG,
        }),
        notionRepo: new NotionRepository(Config.Notion.KEY),
      }).run();
    })
  );
  console.dir({ allResult }, { depth: null });
};
