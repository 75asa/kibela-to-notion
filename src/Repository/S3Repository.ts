import {
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Config } from "~/Config";

export class S3Repository {
  #s3client;
  #BUCKET_NAME;

  constructor() {
    const { ID, SECRET, REGION, BUCKET_NAME } = Config.AWS;
    if (!ID || !SECRET || !REGION || !BUCKET_NAME) {
      throw new Error("AWS credentials not set");
    }
    this.#BUCKET_NAME = BUCKET_NAME;
    this.#s3client = new S3Client({
      region: REGION,
      credentials: { accessKeyId: ID, secretAccessKey: SECRET },
    });
  }

  async init() {
    await this.#getBucket();
  }

  async #getBucket() {
    let data = null;
    try {
      data = await this.#s3client.send(
        new ListObjectsCommand({
          Delimiter: "attachments/",
          Bucket: this.#BUCKET_NAME,
        })
      );
      if (!data.Name) throw new Error("No bucket found");
    } catch (e) {
      throw e;
    }
    return data;
  }

  async getBucketContents() {
    const list = await this.#getBucket();
  }

  async uploadFile(arg: {
    buff: Buffer;
    fileName: string;
    deliminator: string;
    mineType: string;
  }) {
    const { buff: stream, fileName, deliminator, mineType } = arg;
    const params = {
      Bucket: this.#BUCKET_NAME,
      Key: `${deliminator}/${fileName}`,
      Body: stream,
      ContentType: mineType,
    };
    try {
      return await this.#s3client.send(new PutObjectCommand(params));
    } catch (e) {
      throw e;
    }
  }
}
