import { omitNull } from "~/util/omitNull";
import { StrapiContainerSchema } from "./StrapiContainer";

export const StrapiBackgroundOptionalSchema = StrapiContainerSchema.nullable()
  .transform(omitNull)
  .optional();
