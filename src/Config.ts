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
    export const LOG_LEVEL = process.env.REDIS_LOG_LEVEL || "DEBUG";
    export namespace Props {
      export const AUTHOR = "author";
      export const CONTRIBUTORS = "contributors";
      export const FOLDERS = "folders";
      export const GROUPS = "groups";
      export const COMMENTS = "comments";
    }
  }
  export namespace Redis {
    export const SHOW_FRIENDLY_ERROR_STACK = true;
    export const NO_DELAY = true;
  }
}
