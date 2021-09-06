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
    for (const paths of allAttachmentsPath) {
      // get name and fullPath
      // TODO: S3 upload
      let fileBuff = [];
      const stream = this.markdownRepo.createReadFileStream(paths.fullPath);
      for await (const chunk of stream) {
        fileBuff.push(chunk);
      }
      await this.s3Repo.uploadFile({
        buff: Buffer.concat(fileBuff),
        fileName: paths.name,
        deliminator: this.deliminator,
        mineType: paths.mineType.mime,
      });
      // https://kibela-to-notion.s3.ap-northeast-1.amazonaws.com/0/100.jpg
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
