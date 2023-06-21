import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const schema = z.object({ excessiveDisposableIncome: YesNoAnswer });

export const verfuegbaresEinkommenStep = {
  schema,
};
