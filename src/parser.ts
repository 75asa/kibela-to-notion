import fs from "fs";
import path from "path";

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

const parser = (fileName: string) => {
  const file = fs.readFileSync(fileName, "utf8");
  const result = metaDataParser(file) as ParsedResultProps;
  const metaData = result.metadata as KibelaMetaData;
  console.dir(metaData);
  return metaData;
};

export const getAllMetaData = () => {
  const dirPath = path.resolve(__dirname, "../notes");
  const allDirent = fs.readdirSync(dirPath, {
    encoding: "utf-8",
    withFileTypes: true,
  });

  const metaMap = new Map<number, KibelaMetaData>();

  allDirent.forEach(file => {
      const name = file.name
      const meta = parser(path.resolve(dirPath, name));
      const prefixNumber = Number(name.split("-")[0]);
      metaMap.set(prefixNumber, meta);
  });

  return metaMap;
};
