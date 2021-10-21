import { GoogleDriveRepository } from "../../Infra";
import { IFileRepository } from "../../Repository";
import fs from "fs";
import { PassThrough } from "stream";

export class UploadGoogleDrive {
  #repo: GoogleDriveRepository;
  constructor(repo: IFileRepository) {
    if (!(repo instanceof GoogleDriveRepository))
      throw new Error("Invalid repository");
    this.#repo = repo;
  }
  async invoke(
    buff: fs.ReadStream | Buffer | PassThrough,
    name: string,
    mimeType?: string
  ) {
    return await this.#repo.uploadFile({
      buff,
      fileName: name,
      mimeType,
    });
  }
}
