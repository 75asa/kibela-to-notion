import { ImageUploader } from "~/Controller/ImageUploader";
import {
  MarkdownRepository,
  IFileRepository,
  RedisRepository,
} from "~/Repository";
import { Config } from "~/Config";
import { GoogleDriveRepository, S3Repository } from "../Infra";
import { generateUploadAllImagesOption } from "../Provider/UploadAllImagesOptionProvider";

const { SHOW_FRIENDLY_ERROR_STACK, NO_DELAY, DB } = Config.Redis;

export const UploadAllImages = async () => {
  const { storageMode, uploadTargets } = generateUploadAllImagesOption();
  let repository: IFileRepository;

  const allResult = await Promise.all(
    uploadTargets.map(async target => {
      const { delimiterName, attachmentsPath } = target;
      if (storageMode === "GoogleDrive") {
        repository = await GoogleDriveRepository.create(delimiterName);
      } else if (storageMode === "S3") {
        repository = await S3Repository.create(delimiterName);
      } else {
        throw new Error("storageMode is not defined");
      }
      return await new ImageUploader(
        new MarkdownRepository({ attachmentsPath }),
        repository,
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
