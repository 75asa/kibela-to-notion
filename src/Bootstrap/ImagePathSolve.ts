import { ImagePathSolver } from "~/Controller/ImagePathSolver";
import { generateImageOption } from "~/Provider/ImagePathSolveOptionProvider";
import { MarkdownRepository } from "~/Repository/MarkdownRepository";
import { S3Repository } from "~/Repository/S3Repository";

export const ImagePathSolve = async () => {
  // NOTE: add option?
  const options = generateImageOption();
  // S3 setting
  await new ImagePathSolver(
    new MarkdownRepository(options.notesPath),
    new S3Repository()
  ).run();
};
