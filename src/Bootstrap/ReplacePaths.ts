import { PathsReplacer } from "~/Controller/PathsReplacer";
import { generateImageOption } from "~/Provider/ReplacePathsOptionProvider";
import { MarkdownRepository, RedisRepository } from "~/Repository";

export const ReplacePaths = async () => {
  const { notesPath, outPath } = generateImageOption();
  await new PathsReplacer(
    new MarkdownRepository({ notesPath, outPath }),
    new RedisRepository({ db: 1 })
  ).run();
};
