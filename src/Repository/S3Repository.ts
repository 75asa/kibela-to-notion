import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { Config } from "~/Config";

const { AWS } = Config;

export class S3Repository {
  #s3client;

  constructor() {
    this.#s3client = new S3Client({
      region: AWS.REGION,
      credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: AWS.REGION }),
        identityPoolId: `kibela-to-notion: ${new Date()}`,
      }),
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
          Bucket: AWS.BUCKET_NAME,
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
}
