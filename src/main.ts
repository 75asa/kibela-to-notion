import { Tag } from "./Bootstrap/Tag";
import { Config } from "./Config";
import { provideOptions } from "./Provider/MainProvider";

const { SOLVE_IMAGE, TAG_NOTES } = Config.Mode;

(async () => {
  const mode = provideOptions();
  switch (mode) {
    case SOLVE_IMAGE:
      // TODO: call bootstrap #solveImage
      //   await solveImage();
      break;
    case TAG_NOTES:
      await Tag();
      break;
    default:
      break;
  }
  process.exit();
})();
