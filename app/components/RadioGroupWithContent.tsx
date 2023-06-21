import { RadioGroup } from "~/components";
import type { StrapiSelect } from "~/services/cms/models/StrapiSelect";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { getRadioGroupProps } from "~/services/props/getRadioGroupProps";

type DefaultOptions = { value: any; text: string }[];

type RadioGroupWithContentProps = {
  name: string;
  content: StrapiFormComponent[];
  defaultOptions?: DefaultOptions;
};

const filterMatchingContent = (
  fieldname: string,
  content: StrapiFormComponent[] = []
) => {
  return content.filter(
    (e) => e.name === fieldname && e.__component === "form-elements.select"
  )[0] as StrapiSelect;
};

export function getRelevantOptions(
  content: StrapiFormComponent[],
  id: string,
  defaultOptions?: DefaultOptions
) {
  const relevantContent = filterMatchingContent(id, content);
  return relevantContent && "options" in relevantContent
    ? relevantContent["options"]
    : defaultOptions;
}

const RadioGroupWithContent = ({
  name,
  content,
  defaultOptions,
}: RadioGroupWithContentProps) => {
  const options = getRelevantOptions(content, name, defaultOptions) ?? [];
  const matchingContent = filterMatchingContent(name, content);
  return (
    <RadioGroup
      {...getRadioGroupProps(matchingContent)}
      name={name}
      options={options}
    />
  );
};

export default RadioGroupWithContent;
