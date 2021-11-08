import { PathsReplacer } from "~/Controller/PathsReplacer";
import { generateReplaceOption } from "~/Provider/ReplacePathsOptionProvider";
import { MarkdownRepository, RedisRepository } from "~/Repository";
import { Config } from "~/Config";

const { SHOW_FRIENDLY_ERROR_STACK, NO_DELAY, DB } = Config.Redis;

export const ReplacePaths = async () => {
  const options = await generateReplaceOption();

  const allResult = await Promise.all(
    options.map(async option => {
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
