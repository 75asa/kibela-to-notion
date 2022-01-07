import { Config } from "~/Config";
import { Tagger } from "~/Controller/Tagger";
import { generateTagOption } from "~/Provider/TagOptionProvider";
import {
  MarkdownRepository,
  RedisRepository,
  NotionRepository,
} from "~/Repository";
import { ConcurrencyLock } from "../Utils";

const { SHOW_FRIENDLY_ERROR_STACK, NO_DELAY, DB } = Config.Redis;

export const Tag = async () => {
  const options = generateTagOption();
  const lock = new ConcurrencyLock({ concurrency: 3, interval: 1000 });
  const allResult = await Promise.all(
    options.map(async option => {
      const { notesPath } = option;
      return await lock.run(async () => {
        const tagger = await Tagger.factory({
          markdownRepo: new MarkdownRepository({ notesPath }),
          redisRepo: new RedisRepository({
            showFriendlyErrorStack: SHOW_FRIENDLY_ERROR_STACK,
            noDelay: NO_DELAY,
            db: DB.TAG,
          }),
          notionRepo: new NotionRepository(Config.Notion.KEY),
        });
        return await tagger.run();
      });
      // return await tagger.run();
    })
  );
  console.dir({ allResult }, { depth: null });
};
