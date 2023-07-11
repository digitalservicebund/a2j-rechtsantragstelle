import { z } from "zod";

export const HasStrapiVersionsSchema = z.object({
  vuid: z.string().uuid(),
  versionNumber: z.number(),
  isVisibleInListView: z.boolean(),
  versions: z.object({ data: z.array(z.any()) }),
});

export type HasStrapiVersions = z.infer<typeof HasStrapiVersionsSchema>;
