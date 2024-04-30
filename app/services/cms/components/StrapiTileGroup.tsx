import { z } from "zod";
import {
  HasOptionalStrapiIdSchema,
  HasStrapiIdSchema,
} from "../models/HasStrapiId";
import { StrapiErrorCategorySchema } from "../models/StrapiErrorCategory";
import { omitNull } from "~/util/omitNull";
import { StrapiTileSchema } from "../models/StrapiTile";
import TileGroup from "~/components/inputs/tile/TileGroup";
import { getImageProps } from "../models/StrapiImage";

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
    showRadioButtonTiles: z
      .boolean()
      .nullable()
      .transform((value) => value ?? false)
      .default(false),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiTileGroup = z.infer<typeof StrapiTileGroupSchema>;

export const StrapiTileGroupComponentSchema = StrapiTileGroupSchema.extend({
  __component: z.literal("form-elements.tile-group"),
});

export const StrapiTileGroup = ({
  errors,
  options,
  ...props
}: StrapiTileGroup) => {
  const errorMessages = errors.data?.flatMap(
    (cmsError) => cmsError.attributes.errorCodes,
  );
  const tileOptions = options.map((tileOption) => ({
    ...omitNull(tileOption),
    image: getImageProps(tileOption.image),
  }));

  return (
    <TileGroup
      errorMessages={errorMessages}
      options={tileOptions}
      {...omitNull(props)}
    />
  );
};
