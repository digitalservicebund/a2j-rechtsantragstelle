import type { StrapiTextarea } from "../cms/models/StrapiTextarea";
import type { TextareaProps } from "~/components/Textarea";
import { TextareaPropsSchema } from "~/components/Textarea";
import { omitNull } from "~/util/omitNull";

export const getTextareaProps = (cmsData: StrapiTextarea): TextareaProps => {
  const errorMessages = cmsData.errors.data?.flatMap(
    (cmsError) => cmsError.attributes.errorCodes,
  );

  return TextareaPropsSchema.parse(omitNull({ ...cmsData, errorMessages }));
};
