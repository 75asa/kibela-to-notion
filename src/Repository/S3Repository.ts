import {
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
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
      // credentials: fromCognitoIdentityPool({
      //   client: new CognitoIdentityClient({
      //     region: REGION,
      //     credentials: { accessKeyId: ID, secretAccessKey: SECRET },
      //   }),
      //   identityPoolId: `kibela-to-notion: ${new Date()}`,
      // }),
      credentials: { accessKeyId: ID, secretAccessKey: SECRET },
    });
  }

  async init() {
    this.#getBucket();
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
    stream: any;
    fileName: string;
    deliminator: string;
    mineType: string;
  }) {
    const { stream, fileName, deliminator, mineType } = arg;
    const params = {
      Bucket: this.#BUCKET_NAME,
      Key: `${deliminator}/${fileName}`,
      Body: stream,
      ContentType: mineType,
      // ContentType: "application/octet-stream",
    };
    try {
      const data = await this.#s3client.send(new PutObjectCommand(params));
      return data;
    } catch (e) {
      throw e;
    }
  }
}
