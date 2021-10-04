import { ImageUploader } from "~/Controller/ImageUploader";
import { generateUploadImagesOption } from "~/Provider/UploadImagesOptionProvider";
import {
  MarkdownRepository,
  S3Repository,
  RedisRepository,
} from "~/Repository";

export const UploadImages = async () => {
  const { attachmentsPath, delimiter } = generateUploadImagesOption();
  await new ImageUploader(
    new MarkdownRepository({ attachmentsPath }),
    new S3Repository(),
    new RedisRepository({ db: 1 }),
    delimiter
  ).run();
};
