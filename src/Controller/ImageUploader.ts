import { v4 as UUIDv4 } from "uuid";
import { Config } from "~/Config";
import {
  MarkdownRepository,
  S3Repository,
  RedisRepository,
} from "~/Repository";

const { BUCKET_NAME, REGION } = Config.AWS;

export class ImageUploader {
  #successCount = 0;
  constructor(
    private markdownRepo: MarkdownRepository,
    private s3Repo: S3Repository,
    private redisRepo: RedisRepository,
    private delimiter: string
  ) {}
  async run() {
    // S3 setup
    await this.s3Repo.init();
    // S3 に画像をアップロード
    const allAttachmentsPath =
      await this.markdownRepo.getAllAttachmentsWitMineType();
    for (const paths of allAttachmentsPath) {
      const { name, fullPath, mineType } = paths;
      const fileName = `attachments/${this.delimiter}/${UUIDv4()}_${name}`;
      let fileBuff = [];
      const stream = this.markdownRepo.createReadFileStream({
        path: fullPath,
      });
      for await (const chunk of stream) {
        fileBuff.push(chunk);
      }
      await this.s3Repo.uploadFile({
        buff: Buffer.concat(fileBuff),
        fileName,
        mineType: mineType?.mime,
      });
      const S3URL = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileName}`;
      // redis に保存
      this.redisRepo.set(name, S3URL);
      this.#successCount++;
    }
    console.log({ successCount: this.#successCount });
  }
}
