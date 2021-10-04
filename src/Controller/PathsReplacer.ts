import * as readline from "readline";
import { MarkdownRepository, RedisRepository } from "~/Repository";

export class PathsReplacer {
  #successCount = 0;
  constructor(
    private markdownRepo: MarkdownRepository,
    private redisRepo: RedisRepository
  ) {}
  async run() {
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
          const S3URL = await this.redisRepo.getKey(`${fileName}.${mineType}`);
          console.log({ name, line, src, fileName, S3URL });
          if (!S3URL) {
            throw new Error(
              `${fileName}.${mineType} is not found on local Redis db: #1`
            );
          }
          line = line.replace(src, S3URL);
        }
        writeStream.write(`${line}\n`);
      }
      writeStream.end();
      this.#successCount++;
    }
    console.log({ successCount: this.#successCount });
  }
}
