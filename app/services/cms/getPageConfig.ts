import type { StrapiFormComponent } from "./models/StrapiFormComponent";
import type { StrapiVorabCheckPage } from "./models/StrapiVorabCheckPage";
import type { StrapiInput as InputContent } from "./models/StrapiInput";

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

type RelevantInputContent = {
  content: StrapiFormComponent[];
  inputName: string;
};

export function getRelevantInputContent({
  inputName,
  content = [],
}: RelevantInputContent) {
  const matchingElements = getInputsContent(content).filter(
    (el) => el.name === inputName
  );
  return matchingElements[0] ?? { type: "text", label: inputName };
}
