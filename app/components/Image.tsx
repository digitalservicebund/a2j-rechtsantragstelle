import { z } from "zod";

export const ImagePropsSchema = z
  .object({
    url: z.string().nullish(),
    width: z.number().optional(),
    height: z.number().optional(),
    alternativeText: z.string().nullish(),
  })
  .readonly();

export type ImageProps = z.infer<typeof ImagePropsSchema>;

function Image({ url, width, height, alternativeText, ...props }: ImageProps) {
  if (!url) return null;
  return (
    <img
      {...props}
      src={url}
      alt={alternativeText ?? ""} // without alternative text an image is treated as decorative
      width={width}
      height={height}
    />
  );
}

export default Image;
