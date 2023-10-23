import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import Image, { ImagePropsSchema } from "./Image";
import RichText from "./RichText";

export const BoxWithImagePropsSchema = z.object({
  identifier: z.string().optional(),
  heading: HeadingPropsSchema.optional(),
  image: ImagePropsSchema.optional(),
  imageLabel: z.string().optional(),
  content: z.string().optional(),
});

type BoxWithImageProps = z.infer<typeof BoxWithImagePropsSchema>;

const BoxWithImage = ({
  identifier,
  heading,
  image,
  imageLabel,
  content,
}: BoxWithImageProps) => {
  return (
    <div
      id={identifier}
      className="flex flex-row items-start gap-32 max-[499px]:flex-col"
    >
      <div className="ds-stack-16">
        {imageLabel && (
          <p className="ds-label-section pt-4 text-gray-800">{imageLabel}</p>
        )}
        {image && (
          <Image
            {...image}
            {...{
              className: content ? "w-[160px]" : "max-w-none",
            }}
          />
        )}
      </div>
      <div className={"ds-stack-8 break-words w-full"}>
        {heading && <Heading {...heading} />}
        {content && <RichText markdown={content} />}
      </div>
    </div>
  );
};

export default BoxWithImage;
