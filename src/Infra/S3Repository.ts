import {
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { v4 as UUIDv4 } from "uuid";
import { Config } from "~/Config";
import { IFileRepository } from "../Repository/FileRepository";

export class S3Repository implements IFileRepository {
  #s3client;
  #BUCKET_NAME;
  #delimiter;

  private constructor(input: {
    ID: string;
    SECRET: string;
    REGION: string;
    BUCKET_NAME: string;
    delimiter: string;
  }) {
    const { ID, SECRET, REGION, BUCKET_NAME, delimiter } = input;
    this.#BUCKET_NAME = BUCKET_NAME;
    this.#delimiter = delimiter;
    this.#s3client = new S3Client({
      region: REGION,
      credentials: { accessKeyId: ID, secretAccessKey: SECRET },
    });
  }

  static async create(delimiter: string) {
    const { ID, SECRET, REGION, BUCKET_NAME } = Config.Storage.AWS;
    if (!ID || !SECRET || !REGION || !BUCKET_NAME) {
      throw new Error("AWS credentials not set");
    }
    return new S3Repository({ ID, SECRET, REGION, BUCKET_NAME, delimiter });
  }

  getS3FileName(fileName: string) {
    return `attachments/${this.#delimiter}/${UUIDv4()}_${fileName}`;
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

  async uploadFile(input: {
    buff: Buffer;
    fileName: string;
    mimeType?: string;
  }) {
    const { buff, fileName, mimeType } = input;
    const params = {
      Bucket: this.#BUCKET_NAME,
      Key: fileName,
      Body: buff,
      ContentType: mimeType,
    };
    try {
      await this.#s3client.send(new PutObjectCommand(params));
    } catch (e) {
      throw e;
    }
  }
}
