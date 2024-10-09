import { z } from "zod";

export const prozesskostenhilfeAntragstellendePersonContext = {};

const _contextObject = z
  .object(prozesskostenhilfeAntragstellendePersonContext)
  .partial();
export type ProzesskostenhilfeAntragstellendePersonContext = z.infer<
  typeof _contextObject
>;
