import type { FormComponentCms } from "./models/FormComponentCms";
import type { StrapiVorabCheckPage } from "./models/StrapiVorabCheckPage";
import type { Input as InputContent } from "./models/Input";
import type { StrapiErrorCategory } from "./models/StrapiErrorCategory";

// FIXME: sammelsurrium

export type StrapiPage = {
  id: number;
  attributes: StrapiVorabCheckPage;
};

export function getInputsContent(content: FormComponentCms[]) {
  return content.filter(
    (el) => el.__component === "form-elements.input"
  ) as InputContent[];
}

export function getRelevantInputContent(
  content: FormComponentCms[] = [],
  inputName: string
) {
  const matchingElements = getInputsContent(content).filter(
    (el) => el.name === inputName
  );
  return matchingElements[0] ?? { type: "text", label: inputName };
}

export const flattenErrorCodes = (
  errors: { attributes: StrapiErrorCategory }[] = []
) => {
  return errors.map((e) => e.attributes.errorCodes).flat();
};
