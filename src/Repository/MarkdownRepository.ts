import fs from "fs";
import path from "path";
import { Config } from "~/Config";

const { ENCODING } = Config.Markdown;
const metaDataParser = require("markdown-yaml-metadata-parser");

interface Comments {
  id: string;
  path: string;
  author: string;
  published_at: string;
  updated_at: string;
  content: string;
}

export interface KibelaMetaData {
  id: string;
  path: string;
  author: string;
  contributors: string[];
  coediting: boolean;
  folders: string[];
  groups: string[];
  published_at: string;
  updated_at: string;
  archived_at: string | null;
  comments: Comments[];
}

export type AllMetaData = {
  prefixNumber: number;
  meta: KibelaMetaData;
}[];

interface ParsedResultProps {
  content: string;
  metadata: {
    [index: string]: any;
  };
}

export class MarkdownRepository {
  #notesPath: string;
  constructor(notesPath: string) {
    this.#notesPath = notesPath;
  }
  #parseMeta(fileName: string) {
    const file = fs.readFileSync(fileName, ENCODING);
    console.log({ file });
    const result = metaDataParser(file) as ParsedResultProps;
    const metaData = result.metadata as KibelaMetaData;
    console.dir(metaData);
    return metaData;
  }

  getAllMeta() {
    const allDirent = fs.readdirSync(this.#notesPath, {
      encoding: ENCODING,
      withFileTypes: true,
    });

    return allDirent.map(file => {
      const name = file.name;
      const fullPath = path.resolve(this.#notesPath, name);
      console.log({ name, fullPath });
      const meta = this.#parseMeta(fullPath);
      const prefixNumber = Number(name.split("-")[0]);
      return {
        prefixNumber,
        meta,
      };
    });
  }

  createReadFileStream() {
    return fs.createReadStream(this.#notesPath, {
      encoding: ENCODING,
      highWaterMark: 64 * 10,
    });
  }

  createWriteFileStream() {
    return fs.createWriteStream(this.#notesPath, {
      encoding: ENCODING,
      highWaterMark: 64 * 10,
    });
  }
}
