import { PathsReplacer } from "~/Controller/PathsReplacer";
import { generateImageOption } from "~/Provider/ReplacePathsOptionProvider";
import { MarkdownRepository } from "~/Repository/MarkdownRepository";
import { S3Repository } from "~/Repository/S3Repository";

export const ReplacePaths = async () => {
  const { notesPath, attachmentsPath, deliminator, outPath } =
    generateImageOption();
  await new PathsReplacer(
    new MarkdownRepository(notesPath, attachmentsPath, outPath),
    new S3Repository(),
    deliminator
  ).run();
};
