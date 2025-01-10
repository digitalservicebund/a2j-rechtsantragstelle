import { z } from "zod";
import { StrapiMetaSchema } from "./StrapiMeta";

export const HasStrapiMetaSchema = z.object({ pageMeta: StrapiMetaSchema });
