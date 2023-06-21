import { z } from "zod";

export const vermoegenOptions = z.enum(["below_10k", "above_10k"]);
export type VermoegenOptions = z.infer<typeof vermoegenOptions>;
const schema = z.object({ vermoegen: vermoegenOptions });

export const vermoegenStep = {
  schema,
};
