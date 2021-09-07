import { Config } from "~/Config";
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
    // S3 に画像をアップロード
    const allAttachmentsPath =
      await this.markdownRepo.getAllAttachmentsWitMineType();
    const fileMap = new Map<string, string>();
    for (const paths of allAttachmentsPath) {
      let fileBuff = [];
      const fileName = paths.name;
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
      const s3URL = `https://${Config.AWS.BUCKET_NAME}.s3.${Config.AWS.REGION}.amazonaws.com/${this.deliminator}/${fileName}`;
      // memo S3 URL
      fileMap.set(paths.name, s3URL);
    }
    // TODO: マークダウンの読み込み
    const allNotesPath = this.markdownRepo.getAllNotes();
    for (const paths of allNotesPath) {
      const stream = this.markdownRepo.createReadFileStream(paths.fullPath);
      for await (const chunk of stream) {
        console.log({ stream: chunk });
        // TODO: 画像を参照してる箇所を探す
        // e.g. <img title='ボタンパターン.png' src='../attachments/3.png' width="1024" data-meta='{"width":1024,"height":503}'/>
        // TODO: 参照箇所があった場合、 writeStream で置き換え
      }
    }
  }
}
