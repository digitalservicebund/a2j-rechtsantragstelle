import { z } from "zod";
import { HasOptionalStrapiIdSchema, HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiErrorCategorySchema } from "./StrapiErrorCategory";
import { StrapiTileSchema } from "./StrapiTile";
import TileGroup from "~/components/inputs/TileGroup";
import Image from "~/components/Image";

const StrapiTileGroupSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    altLabel: z.string().nullable(),
    options: z.array(StrapiTileSchema),
    errors: z.object({
      data: z
        .array(
          HasStrapiIdSchema.extend({
            attributes: StrapiErrorCategorySchema,
          }),
        )
        .optional(),
    }),
    useTwoColumns: z.boolean().nullable(),
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
    ...tileOption,
    image: <Image {...tileOption.image?.data?.attributes} />,
  }));

  return (
    <TileGroup errorMessages={errorMessages} options={tileOptions} {...props} />
  );
};
