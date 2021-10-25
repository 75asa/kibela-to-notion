import * as readline from "readline";
import { Config } from "~/Config";
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
      console.log({ name, fullPath });
      const readStream = this.markdownRepo.createReadFileStream({
        path: fullPath,
        encoding: Config.Markdown.ENCODING,
      });
      const writeStream = this.markdownRepo.createWriteFileStream({
        path: name,
        encoding: Config.Markdown.ENCODING,
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
          const fileURL = await this.redisRepo.getKey(
            `${fileName}.${mineType}`
          );
          console.log({ name, line, src, fileName, fileURL });
          if (!fileURL) {
            throw new Error(
              `${fileName}.${mineType} is not found on local Redis db: #1`
            );
          }
          line = line.replace(src, fileURL);
        }
        writeStream.write(`${line}\n`);
      }
      writeStream.end();
      this.#successCount++;
    }
    console.log({ successCount: this.#successCount });
  }
}
