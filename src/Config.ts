import dotenv from "dotenv";

const loadEnv = () => {
  const config = dotenv.config().parsed;
  if (config) {
    for (const key in config) {
      process.env[key] = config[key];
    }
    console.log("all env vars loading done");
  }
};

export namespace Config {
  loadEnv();
  export namespace Notion {
    export const KEY = process.env.NOTION_KEY!;
    export const DATABASE = process.env.NOTION_DATABASE!;
  }
  export namespace Redis {}
}
