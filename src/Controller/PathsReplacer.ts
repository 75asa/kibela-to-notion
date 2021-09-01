import { MarkdownRepository } from "~/Repository/MarkdownRepository";
import { S3Repository } from "~/Repository/S3Repository";

export class PathsReplacer {
  #successCount = 0;
  constructor(
    private markdownRepo: MarkdownRepository,
    private s3Repo: S3Repository
  ) {}
  async run() {
    // S3 setup
    await this.s3Repo.init();
    // TODO: マークダウンの読み込み
    const stream = this.markdownRepo.createReadFileStream();

    for await (const chunk of stream) {
      console.log({ chunk });
    }
  }
}
