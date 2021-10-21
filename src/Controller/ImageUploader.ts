import { MarkdownRepository, RedisRepository } from "~/Repository";
import { GoogleDriveRepository, S3Repository } from "../Infra";
import { IFileRepository } from "../Repository/FileRepository";
import { UploadS3, UploadGoogleDrive } from "../UseCases/FileUpload/";
import { PassThrough } from "stream";

export class ImageUploader {
  #successCount = 0;
  constructor(
    private markdownRepo: MarkdownRepository,
    private fileRepo: IFileRepository,
    private redisRepo: RedisRepository
  ) {}
  async run() {
    const allAttachmentsPath =
      await this.markdownRepo.getAllAttachmentsWitMineType();

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
      if (this.fileRepo instanceof S3Repository) {
        fileURL = await new UploadS3(this.fileRepo).invoke(
          Buffer.concat(fileBuff),
          name,
          mimeType?.mime
        );
      } else if (this.fileRepo instanceof GoogleDriveRepository) {
        let bufferStream = new PassThrough();
        bufferStream.end(Buffer.concat(fileBuff));
        fileURL = await new UploadGoogleDrive(this.fileRepo).invoke(
          bufferStream,
          name,
          mimeType?.mime
        );
      }
      console.log({ name, fullPath, mimeType, fileURL });
      this.redisRepo.set(name, fileURL);
      this.#successCount++;
    }
    console.log({ successCount: this.#successCount });
  }
}
