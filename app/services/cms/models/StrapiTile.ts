import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiImageSchema, getImageProps } from "./StrapiImage";
import { TilePropsSchema } from "~/components/inputs/Tile";

export const StrapiTileSchema = z
  .object({
    title: z.string(),
    value: z.string(),
    description: z.string().nullable(),
    image: StrapiImageSchema.nullable(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiTile = z.infer<typeof StrapiTileSchema>;

export const getTileProps = (cmsData: StrapiTile) => {
  return TilePropsSchema.parse({
    ...cmsData,
    image: getImageProps(cmsData.image),
  });
};
