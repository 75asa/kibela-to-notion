import { Config } from "~/Config";
import { MarkdownRepository, RedisRepository } from "~/Repository";
import { GoogleDriveRepository, S3Repository } from "../Infra";
import { IFileRepository } from "../Repository/FileRepository";
import { UploadS3, UploadGoogleDrive } from "../UseCases/FileUpload/";

const { BUCKET_NAME, REGION } = Config.Storage.AWS;

export class ImageUploader {
  #successCount = 0;
  constructor(
    private markdownRepo: MarkdownRepository,
    private fireRepo: IFileRepository,
    private redisRepo: RedisRepository
  ) {}
  async run() {
    // S3 setup
    // await this.fireRepo.init();
    const allAttachmentsPath =
      await this.markdownRepo.getAllAttachmentsWitMineType();

    // S3 に画像をアップロード
    for (const paths of allAttachmentsPath) {
      const { name, fullPath, mimeType } = paths;
      let fileBuff = [];
      let fileURL = "";
      const stream = this.markdownRepo.createReadFileStream({
        path: fullPath,
      });
      for await (const chunk of stream) {
        fileBuff.push(chunk);
      }
      if (this.fireRepo instanceof S3Repository) {
        fileURL = await new UploadS3(this.fireRepo).invoke(
          Buffer.concat(fileBuff),
          name,
          mimeType?.mime
        );
      } else if (this.fireRepo instanceof GoogleDriveRepository) {
        fileURL = await new UploadGoogleDrive(this.fireRepo).invoke(
          Buffer.concat(fileBuff),
          name,
          mimeType?.mime
        );
      }
      this.redisRepo.set(name, fileURL);
      this.#successCount++;
    }
    console.log({ successCount: this.#successCount });
  }
}
