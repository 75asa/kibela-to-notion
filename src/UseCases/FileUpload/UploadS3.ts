import { S3Repository } from "../../Infra";
import { IFileRepository } from "../../Repository";
import { Config } from "~/Config";

const { BUCKET_NAME, REGION } = Config.Storage.AWS;

export class UploadS3 {
  #repo: S3Repository;
  constructor(repo: IFileRepository) {
    if (!(repo instanceof S3Repository)) throw new Error("Invalid repository");
    this.#repo = repo;
  }
  async invoke(buff: Buffer, name: string, mimeType?: string) {
    const fileName = this.#repo.getS3FileName(name);
    await this.#repo.uploadFile({
      buff,
      fileName,
      mimeType: mimeType,
    });
    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${name}`;
  }
}
