import { RadioGroup } from "~/components";
import type { StrapiSelect } from "~/services/cms/models/StrapiSelect";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";

type DefaultOptions = { value: any; text: string }[];

type RadioGroupWithContentProps = {
  name: string;
  content: StrapiFormComponent[];
  defaultOptions?: DefaultOptions;
};

const filterMatchingContent = (
  content: StrapiFormComponent[] = [],
  fieldname: string
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
  const relevantContent = filterMatchingContent(content, id);
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
  const matchingContent = filterMatchingContent(content, name);
  return (
    <RadioGroup
      name={name}
      options={options}
      label={matchingContent?.label}
      altLabel={matchingContent?.altLabel}
    />
  );
};

export default RadioGroupWithContent;
