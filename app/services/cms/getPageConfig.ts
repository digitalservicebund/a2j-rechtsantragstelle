import type { StrapiFormComponent } from "./models/StrapiFormComponent";
import type { StrapiVorabCheckPage } from "./models/StrapiVorabCheckPage";
import type { StrapiInput as InputContent } from "./models/StrapiInput";
import type { StrapiErrorCategory } from "./models/StrapiErrorCategory";

// FIXME: sammelsurrium

export type StrapiPage = {
  id: number;
  attributes: StrapiVorabCheckPage;
};

export function getInputsContent(content: StrapiFormComponent[]) {
  return content.filter(
    (el) => el.__component === "form-elements.input"
  ) as InputContent[];
}

export function getRelevantInputContent(
  content: StrapiFormComponent[] = [],
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
