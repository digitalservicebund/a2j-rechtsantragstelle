import { z } from "zod";

export const ImagePropsSchema = z
  .object({
    url: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    alternativeText: z.string().optional(),
  })
  .readonly();

export type ImageProps = z.infer<typeof ImagePropsSchema>;

function Image({ url, width, height, alternativeText, ...props }: ImageProps) {
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
