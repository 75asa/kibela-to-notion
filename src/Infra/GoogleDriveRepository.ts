import { drive_v3, google } from "googleapis";
import { Compute, JWT, UserRefreshClient } from "google-auth-library";
import fs from "fs";
import { IFileRepository } from "../Repository/FileRepository";
import { Config } from "../Config";

const { CREDENTIALS_PATH } = Config.Storage.GoogleDrive;

export class GoogleDriveRepository implements IFileRepository {
  #DriveClient: drive_v3.Drive;
  // only callable by factory method
  private constructor(auth: Compute | JWT | UserRefreshClient) {
    this.#DriveClient = google.drive({ version: "v3", auth });
  }

  static async create() {
    if (!fs.existsSync(CREDENTIALS_PATH))
      throw new Error("Credentials not found");
    // automatically creates a client with credentials, otherwise specify the credentials file path
    process.env.GOOGLE_APPLICATION_CREDENTIALS = CREDENTIALS_PATH;
    const auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });
    return new GoogleDriveRepository(auth);
  }

  async init() {
    try {
      const res = await this.#DriveClient.files.list({
        pageSize: 10,
        fields: "nextPageToken, files(id, name)",
      });
      const files = res.data.files;
      if (files && files.length) {
        console.log("Files:");
        files.map(file => console.log(`${file.name} (${file.id})`));
      } else {
        console.log("No files found.");
      }
    } catch (error) {
      console.log("The API returned an error: " + error);
    }
  }

  async uploadFile(input: {
    buff: Buffer;
    fileName: string;
    mimeType?: string;
  }) {
    const { buff, fileName, mimeType } = input;
    const result = await this.#DriveClient.files.create({
      requestBody: {
        name: fileName,
      },
      media: {
        mimeType: mimeType,
        body: buff,
      },
    });
    const driveID = result.data.id;
    if (!driveID) throw new Error("Drive ID not found");
    return `https://drive.google.com/file/d/${driveID}/view`;
  }
}
