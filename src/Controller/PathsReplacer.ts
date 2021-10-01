import * as readline from "readline";
import { Config } from "~/Config";
import { MarkdownRepository, S3Repository } from "~/Repository";

const { BUCKET_NAME, REGION } = Config.AWS;

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
      const { name, fullPath, mineType } = paths;
      let fileBuff = [];
      const stream = this.markdownRepo.createReadFileStream({
        path: fullPath,
      });
      for await (const chunk of stream) {
        fileBuff.push(chunk);
      }
      await this.s3Repo.uploadFile({
        buff: Buffer.concat(fileBuff),
        fileName: name,
        deliminator: this.deliminator,
        mineType: mineType.mime,
      });
      const S3URL = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${this.deliminator}/${name}`;
      // memo S3 URL
      fileMap.set(name, S3URL);
    }
    // マークダウンの読み込み
    const allNotesPath = this.markdownRepo.getAllNotes();
    for (const paths of allNotesPath) {
      const { name, fullPath } = paths;
      const readStream = this.markdownRepo.createReadFileStream({
        path: fullPath,
        encoding: "utf8",
      });
      const writeStream = this.markdownRepo.createWriteFileStream({
        path: name,
        encoding: "utf8",
      });

      const rl = readline.createInterface({
        input: readStream,
        output: writeStream,
      });

      for await (let line of rl) {
        const REGEXP = /'..\/attachments\/([0-9]+)\.([a-zA-Z]+)'/;
        const found = line.match(REGEXP);
        if (found) {
          const [src, fileName, mineType] = found;
          const S3URL = fileMap.get(`${fileName}.${mineType}`);
          console.log({ name, line, src, fileName, S3URL });
          if (S3URL) line = line.replace(src, S3URL);
        }
        writeStream.write(`${line}\n`);
      }
      writeStream.end();
      this.#successCount++;
    }
    console.log({ successCount: this.#successCount });
  }
}
