import { omitNull } from "~/util/omitNull";
import { DropdownPropsSchema } from "~/components/Select";
import type { StrapiDropdown } from "~/services/cms/models/StrapiDropdown";

export const getDropdownProps = (cmsData: StrapiDropdown) => {
  const errorMessages = cmsData.errors.data?.flatMap(
    (cmsError) => cmsError.attributes.errorCodes,
  );

  const props = {
    ...cmsData,
    errorMessages,
  };
  return DropdownPropsSchema.parse(omitNull(props));
};
