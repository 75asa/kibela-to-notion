import { PathsReplacer } from "~/Controller/PathsReplacer";
import { generateImageOption } from "~/Provider/ReplacePathsOptionProvider";
import { MarkdownRepository, S3Repository } from "~/Repository";

export const ReplacePaths = async () => {
  const { notesPath, attachmentsPath, deliminator, outPath } =
    generateImageOption();
  await new PathsReplacer(
    new MarkdownRepository(notesPath, attachmentsPath, outPath),
    new S3Repository(),
    deliminator
  ).run();
};
