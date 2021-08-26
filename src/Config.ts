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
  export namespace Mode {
    export const SOLVE_IMAGE = "SOLVE_IMAGE";
    export const TAG_NOTES = "TAG_NOTES";
  }

  export namespace Markdown {
    export namespace Path {
      export const NOTES = "../notes";
      export const ATTACHMENTS = "../attachments";
    }
    export const ENCODING = "utf8";
  }

  export namespace AWS {
    export const ID = process.env.AWS_ID;
    export const SECRET = process.env.AWS_SECRET;
    export const REGION = process.env.AWS_REGION;
    export const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
  }
  export namespace Notion {
    export const KEY = process.env.NOTION_KEY!;
    export const DATABASE = process.env.NOTION_DATABASE!;
    export const LOG_LEVEL = process.env.REDIS_LOG_LEVEL || "DEBUG";
    export namespace Props {
      export const NAME = "Name";
      export const PREFIX_NUMBER = "prefixNumber";
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
