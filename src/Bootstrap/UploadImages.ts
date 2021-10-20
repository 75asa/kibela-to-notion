import { ImageUploader } from "~/Controller/ImageUploader";
import { generateUploadImagesOption } from "~/Provider/UploadImagesOptionProvider";
import {
  MarkdownRepository,
  S3Repository,
  RedisRepository,
} from "~/Repository";
import { Config } from "~/Config";

const { SHOW_FRIENDLY_ERROR_STACK, NO_DELAY, DB } = Config.Redis;

export const UploadImages = async () => {
  // option で S3 or Drive 選べるようにする
  const { attachmentsPath, delimiter } = generateUploadImagesOption();
  await new ImageUploader(
    new MarkdownRepository({ attachmentsPath }),
    new S3Repository(),
    new RedisRepository({
      showFriendlyErrorStack: SHOW_FRIENDLY_ERROR_STACK,
      noDelay: NO_DELAY,
      db: DB.IMAGE,
    }),
    delimiter
  ).run();
};
