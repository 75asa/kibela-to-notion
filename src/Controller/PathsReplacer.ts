import { MarkdownRepository } from "~/Repository/MarkdownRepository";
import { S3Repository } from "~/Repository/S3Repository";

export class PathsReplacer {
  #successCount = 0;
  constructor(
    private markdownRepo: MarkdownRepository,
    private s3Repo: S3Repository,
    private deliminator: string
  ) {}
  async run() {
    // S3 setup
    await this.s3Repo.init();
    // TODO: S3 に画像をアップロード
    // const allAttachmentsPath = this.markdownRepo.getAllNotes();
    const allAttachmentsPath =
      await this.markdownRepo.getAllAttachmentsWitMineType();
    for await (const attachmentPath of allAttachmentsPath) {
      // get name and fullPath
      // TODO: S3 upload
      const stream = this.markdownRepo.createReadFileStream(
        attachmentPath.fullPath
      );
      await this.s3Repo.uploadFile({
        stream,
        fileName: attachmentPath.name,
        deliminator: this.deliminator,
        mineType: attachmentPath.mineType.mime,
      });
      // TODO: memo S3 URL
    }
    // TODO: マークダウンの読み込み
    const allNotesPath = this.markdownRepo.getAllNotes();
    for await (const notePaths of allNotesPath) {
      const streams = this.markdownRepo.createReadFileStream(
        notePaths.fullPath
      );
      for await (const stream of streams) {
        console.log({ stream });
      }
    }
  }
}
