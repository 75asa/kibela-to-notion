import dotenv from "dotenv";

const config = dotenv.config().parsed;

if (config) {
  for (const key in config) {
    process.env[key] = config[key];
  }
}
export namespace Config {
  export namespace Notion {
    export const KEY = process.env.NOTION_KEY!;
    export const DATABASE = process.env.NOTION_DATABASE!;
  }
}
