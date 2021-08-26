import fs from "fs";
import path from "path";
import { Config } from "src/Config";

const { Path, ENCODING } = Config.Markdown;
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

interface ParsedResultProps {
  content: string;
  metadata: {
    [index: string]: any;
  };
}

export class MarkdownRepository {
  #allMeta;
  constructor(notesPath: string) {
    this.#allMeta = this.#getAllMeta(notesPath);
  }
  #parseMeta(fileName: string) {
    const file = fs.readFileSync(fileName);
    const result = metaDataParser(file) as ParsedResultProps;
    const metaData = result.metadata as KibelaMetaData;
    console.dir(metaData);
    return metaData;
  }

  #getAllMeta(notesPath: string) {
    const dirPath = path.resolve(__dirname, notesPath);
    const allDirent = fs.readdirSync(dirPath, {
      encoding: ENCODING,
      withFileTypes: true,
    });

    return allDirent.map(file => {
      const name = file.name;
      const meta = this.#parseMeta(path.resolve(dirPath, name));
      const prefixNumber = Number(name.split("-")[0]);
      return {
        prefixNumber,
        meta,
      };
    });
  }

  get allMetaData() {
    return this.#allMeta;
  }

  getAllPrefix() {
    return this.#allMeta.map(item => item.prefixNumber);
  }
}
