import { z } from "zod";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { kinderArraySchema } from "../context";

export const kinderContext = {
  hasKinder: YesNoAnswer,
  kinder: kinderArraySchema,
  pageData: pageDataSchema,
};

const _object = z.object(kinderContext).partial();

export type KinderContext = z.infer<typeof _object>;
