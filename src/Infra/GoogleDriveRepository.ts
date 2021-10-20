import { drive_v3, google } from "googleapis";
import { Compute, JWT, UserRefreshClient } from "google-auth-library";
import { IFileRepository } from "../Repository/FileRepository";

export class GoogleDriveRepository implements IFileRepository {
  #DriveClient: drive_v3.Drive;
  private constructor(auth: Compute | JWT | UserRefreshClient) {
    this.#DriveClient = google.drive({ version: "v3", auth });
  }

  static async factory() {
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

  async uploadFile(input: { mimeType: string; body: any }) {
    const { mimeType, body } = input;
    await this.#DriveClient.files.create({
      media: {
        mimeType,
        body,
      },
    });
  }
}
