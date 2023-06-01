import { z } from "zod";

export const ImagePropsSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
  alternativeText: z.string().optional(),
});

export type ImageProps = z.infer<typeof ImagePropsSchema>;

function Image({ url, width, height, alternativeText, ...props }: ImageProps) {
  if (!url) return null;

  return (
    <img
      {...props}
      src={url}
      alt={alternativeText ?? ""}
      width={width}
      height={height}
    />
  );
}

export default Image;
