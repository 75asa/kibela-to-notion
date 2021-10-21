import { drive_v3, google } from "googleapis";
import { Compute, JWT, UserRefreshClient } from "google-auth-library";
import fs from "fs";
import { PassThrough } from "stream";
import { IFileRepository } from "../Repository/FileRepository";
import { Config } from "../Config";

const { CREDENTIALS_PATH, FOLDER_ID } = Config.Storage.GoogleDrive;

export class GoogleDriveRepository implements IFileRepository {
  #DriveClient: drive_v3.Drive;
  #parentID: string;
  // only callable by factory method
  private constructor(auth: Compute | JWT | UserRefreshClient) {
    this.#DriveClient = google.drive({ version: "v3", auth });
    this.#parentID = "";
  }

  static async create(delimiter: string) {
    if (!fs.existsSync(CREDENTIALS_PATH))
      throw new Error("Credentials not found");
    // automatically creates a client with credentials, otherwise specify the credentials file path
    if (!FOLDER_ID) throw new Error("Folder ID not found");
    process.env.GOOGLE_APPLICATION_CREDENTIALS = CREDENTIALS_PATH;

    const auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });
    const instance = new GoogleDriveRepository(auth);
    const parentID = await instance.#createDirectory(delimiter);
    if (!parentID) throw new Error("Parent not found");
    instance.parentID = parentID;
    return instance;
  }

  async uploadFile(input: {
    buff: fs.ReadStream | Buffer | PassThrough,
    fileName: string;
    mimeType?: string;
  }) {
    const { buff, fileName, mimeType } = input;
    const result = await this.#DriveClient.files.create({
      requestBody: {
        name: fileName,
        parents: [this.#parentID],
      },
      media: {
        mimeType,
        body: buff,
      },
    });
    const driveID = result.data.id;
    if (!driveID) throw new Error("Drive ID not found");
    return `https://drive.google.com/file/d/${driveID}/view`;
  }

  async #createDirectory(name: string) {
    const params = {
      requestBody: {
        name,
        mimeType: "application/vnd.google-apps.folder",
        parents: [FOLDER_ID!],
      },
    };
    try {
      const { data } = await this.#DriveClient.files.create(params);
      console.dir({ data }, { depth: null });
      return data.id;
    } catch (error) {
      console.log(error);
    }
  }

  set parentID(id: string) {
    this.#parentID = id;
  }
}
