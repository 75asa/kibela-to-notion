import { ImageUploader } from "~/Controller/ImageUploader";
import { generateUploadImagesOption } from "~/Provider/UploadImagesOptionProvider";
import {
  MarkdownRepository,
  IFileRepository,
  RedisRepository,
} from "~/Repository";
import { Config } from "~/Config";
import { GoogleDriveRepository, S3Repository } from "../Infra";

const { SHOW_FRIENDLY_ERROR_STACK, NO_DELAY, DB } = Config.Redis;

export const UploadImages = async () => {
  const { attachmentsPath, delimiterName, storageMode } =
    generateUploadImagesOption();
  let repository: IFileRepository;
  if (storageMode === "GoogleDrive") {
    repository = await GoogleDriveRepository.create(delimiterName);
  } else if (storageMode === "S3") {
    repository = await S3Repository.create(delimiterName);
  } else {
    throw new Error("storageMode is not defined");
  }
  await new ImageUploader(
    new MarkdownRepository({ attachmentsPath }),
    repository,
    new RedisRepository({
      showFriendlyErrorStack: SHOW_FRIENDLY_ERROR_STACK,
      noDelay: NO_DELAY,
      db: DB.IMAGE,
    })
  ).run();
};
