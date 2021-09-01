import { PathsReplacer } from "~/Controller/PathsReplacer";
import { generateImageOption } from "~/Provider/ReplacePathsOptionProvider";
import { MarkdownRepository } from "~/Repository/MarkdownRepository";
import { S3Repository } from "~/Repository/S3Repository";

export const ReplacePaths = async () => {
  // NOTE: add option?
  const options = generateImageOption();
  // S3 setting
  await new PathsReplacer(
    new MarkdownRepository(options.notesPath),
    new S3Repository()
  ).run();
};
