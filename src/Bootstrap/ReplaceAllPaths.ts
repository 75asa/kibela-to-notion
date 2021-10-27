import { PathsReplacer } from "~/Controller/PathsReplacer";
import { MarkdownRepository, RedisRepository } from "~/Repository";
import { Config } from "~/Config";
import { generateReplaceAllOption } from "../Provider/ReplaceAllPathsOptionProvider";

const { SHOW_FRIENDLY_ERROR_STACK, NO_DELAY, DB } = Config.Redis;

export const ReplaceAllPaths = async () => {
  const allOptions = await generateReplaceAllOption();
  console.dir({ allOptions }, { depth: null });
  const allResult = await Promise.all(
    allOptions.map(async option => {
      const { notesPath, outPath } = option;
      return await new PathsReplacer(
        new MarkdownRepository({ notesPath, outPath }),
        new RedisRepository({
          showFriendlyErrorStack: SHOW_FRIENDLY_ERROR_STACK,
          noDelay: NO_DELAY,
          db: DB.IMAGE,
        })
      ).run();
    })
  );
  console.dir({ allResult }, { depth: null });
};
