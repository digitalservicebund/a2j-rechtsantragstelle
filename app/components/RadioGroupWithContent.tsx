import { RadioGroup } from "~/components";
import type {
  FormComponentCMS,
  Select,
} from "~/services/cms/models/formComponents";

type DefaultOptions = { value: any; text: string }[];

type RadioGroupWithContentProps = {
  name: string;
  content: FormComponentCMS[];
  defaultOptions?: DefaultOptions;
};

const filterMatchingContent = (
  content: FormComponentCMS[] = [],
  fieldname: string
) => {
  return content.filter(
    (e) => e.name === fieldname && e.__component === "form-elements.select"
  )[0] as Select;
};

export function getRelevantOptions(
  content: FormComponentCMS[],
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
