import dotenv from "dotenv";
import path from "path";

const config = dotenv.config().parsed;

if (config) {
  for (const key in config) {
    process.env[key] = config[key];
  }
  console.log("all env vars loading done");
}

export namespace Config {
  export namespace Mode {
    export const REPLACE_PATHS = "REPLACE_PATHS";
    export const TAG_NOTES = "TAG_NOTES";
    export const UPLOAD_IMAGES = "UPLOAD_IMAGES";
  }

  export namespace Markdown {
    export const ENCODING = "utf8";
    export namespace Path {
      export const NOTES = path.resolve(__dirname, "../notes");
      export const OUT = path.resolve(__dirname, "../out");
      export const ATTACHMENTS = path.resolve(__dirname, "../attachments");
    }
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
    export namespace DB {
      export const IMAGE = Number(process.env.REDIS_IMAGE_DB || 0);
      export const TAG = Number(process.env.REDIS_TAG_DB || 1);
    }
  }
}
