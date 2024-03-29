import { z } from "zod";
import { HasOptionalStrapiIdSchema, HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiErrorCategorySchema } from "./StrapiErrorCategory";
import { omitNull } from "~/util/omitNull";
import { StrapiTileSchema, getTileProps } from "./StrapiTile";
import { TileGroupPropsSchema } from "~/components/inputs/TileGroup";

const StrapiTileGroupSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    altLabel: z.string().nullable(),
    options: z.array(StrapiTileSchema),
    errors: z.object({
      data: z.array(
        HasStrapiIdSchema.extend({
          attributes: StrapiErrorCategorySchema,
        }),
      ),
    }),
    useTwoColumns: z.boolean().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiTileGroup = z.infer<typeof StrapiTileGroupSchema>;

export const StrapiTileGroupComponentSchema = StrapiTileGroupSchema.extend({
  __component: z.literal("form-elements.tile-group"),
});

export const getTileGroupProps = (cmsData: StrapiTileGroup) => {
  const errorMessages = cmsData.errors.data?.flatMap(
    (cmsError) => cmsError.attributes.errorCodes,
  );

  const options = cmsData.options.map(getTileProps);

  return TileGroupPropsSchema.parse(
    omitNull({ ...cmsData, errorMessages, options }),
  );
};
