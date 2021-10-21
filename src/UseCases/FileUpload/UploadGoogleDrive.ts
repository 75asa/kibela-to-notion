import { GoogleDriveRepository } from "../../Infra";
import { IFileRepository } from "../../Repository";

export class UploadGoogleDrive {
  #repo: GoogleDriveRepository;
  constructor(repo: IFileRepository) {
    if (!(repo instanceof GoogleDriveRepository))
      throw new Error("Invalid repository");
    this.#repo = repo;
  }
  async invoke(buff: Buffer, name: string, mimeType?: string) {
    return await this.#repo.uploadFile({ buff, fileName: name, mimeType });
  }
}
