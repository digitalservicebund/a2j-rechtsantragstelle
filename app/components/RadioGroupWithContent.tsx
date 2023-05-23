import { RadioGroup } from "~/components";
import type { Select } from "~/services/cms/models/Select";
import type { FormComponentCms } from "~/services/cms/models/FormComponentCms";

type DefaultOptions = { value: any; text: string }[];

type RadioGroupWithContentProps = {
  name: string;
  content: FormComponentCms[];
  defaultOptions?: DefaultOptions;
};

const filterMatchingContent = (
  content: FormComponentCms[] = [],
  fieldname: string
) => {
  return content.filter(
    (e) => e.name === fieldname && e.__component === "form-elements.select"
  )[0] as Select;
};

export function getRelevantOptions(
  content: FormComponentCms[],
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
