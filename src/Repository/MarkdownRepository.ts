import fs from "fs";
import path from "path";
import { Config } from "~/Config";
import { fromFile } from "file-type";

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
  #attachmentsPath: string;
  constructor(notesPath: string, attachmentsPath?: string) {
    this.#notesPath = notesPath;
    this.#attachmentsPath = attachmentsPath || "";
  }

  #parseMeta(fileName: string) {
    const file = fs.readFileSync(fileName, ENCODING);
    console.log({ file });
    const result = metaDataParser(file) as ParsedResultProps;
    const metaData = result.metadata as KibelaMetaData;
    console.dir(metaData);
    return metaData;
  }

  #getFullPathFromAllDirent(directory: string) {
    const allDirent = fs.readdirSync(directory, {
      encoding: ENCODING,
      withFileTypes: true,
    });
    return allDirent.map(file => {
      const name = file.name;
      const fullPath = path.resolve(directory, name);
      return { name, fullPath };
    });
  }

  getAllNotes() {
    return this.#getFullPathFromAllDirent(this.#notesPath);
  }

  async getAllNotesWitMineType() {
    return this.#getFullPathFromAllDirent(this.#notesPath).map(async item => {
      return { ...item, mineType: await fromFile(item.fullPath) };
    });
  }

  getAllAttachments() {
    return this.#getFullPathFromAllDirent(this.#attachmentsPath);
  }

  async getAllAttachmentsWitMineType() {
    return await Promise.all(
      this.#getFullPathFromAllDirent(this.#attachmentsPath).map(async item => {
        const mineType = await fromFile(item.fullPath);
        if (!mineType) throw new Error("mineType is not defined");
        return { ...item, mineType };
      })
    );
  }

  getAllMeta() {
    return this.getAllNotes().map(file => {
      const meta = this.#parseMeta(file.fullPath);
      const prefixNumber = Number(file.name.split("-")[0]);
      return {
        prefixNumber,
        meta,
      };
    });
  }

  createReadFileStream(path: string) {
    return fs.createReadStream(path, {
      // encoding: ENCODING,
      // highWaterMark: 64 * 10,
    });
  }

  createWriteFileStream(path: string) {
    return fs.createWriteStream(path, {
      encoding: ENCODING,
      // highWaterMark: 64 * 10,
    });
  }
}
