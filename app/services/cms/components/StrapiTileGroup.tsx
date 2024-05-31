import { z } from "zod";
import TileGroup from "~/components/inputs/tile/TileGroup";
import { omitNull } from "~/util/omitNull";
import {
  HasOptionalStrapiIdSchema,
  HasStrapiIdSchema,
} from "../models/HasStrapiId";
import { StrapiErrorCategorySchema } from "../models/StrapiErrorCategory";
import { getImageProps } from "../models/StrapiImage";
import { StrapiTileSchema } from "../models/StrapiTile";

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
      .transform((value) => value ?? false),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiTileGroup = z.infer<typeof StrapiTileGroupSchema>;

export const StrapiTileGroupComponentSchema = StrapiTileGroupSchema.extend({
  __component: z.literal("form-elements.tile-group"),
});

const StrapiTileGroup = ({ errors, options, ...props }: StrapiTileGroup) => {
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

export default StrapiTileGroup;
