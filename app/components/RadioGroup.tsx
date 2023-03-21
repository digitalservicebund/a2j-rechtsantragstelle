import type { ReactNode } from "react";
import { useField } from "remix-validated-form";
import { InputError, Radio, Stack } from "~/components";
import type { PageContent, ElementContent } from "~/services/cms/getPageConfig";
import invariant from "tiny-invariant";

type RadioGroupProps = {
  name: string;
  options: { value: string; label?: ReactNode }[];
  pageContent?: PageContent;
};

const RadioGroup = ({ name, options, pageContent }: RadioGroupProps) => {
  const { error } = useField(name);
  let fieldContentTemp: ElementContent | undefined = undefined;
  // TODO remove once all pages are converted to use Strapi
  if (pageContent) {
    invariant(
      pageContent,
      `pageContent must not be undefined for field ${name}`
    );
    fieldContentTemp = pageContent.find((o) => "name" in o && o.name == name);
    invariant(
      fieldContentTemp,
      `fieldContent must not be undefined for field ${name}`
    );
    invariant(
      "options" in fieldContentTemp,
      `fieldContent must be a select field with options for field ${name}`
    );
  }
  // TODO how do you do this smoothly?
  const fieldContent = fieldContentTemp;

  return (
    <Stack space="m">
      {options.map((o) => (
        <Radio
          key={o.value}
          name={name}
          value={o.value}
          label={o.label}
          contentLabel={
            fieldContent?.options.find(
              (optionContent) => optionContent.value == o.value
            )?.text
          }
        />
      ))}
      {error ? (
        <InputError inputId={name}>Bitte was auswählen.</InputError>
      ) : (
        ""
      )}
    </Stack>
  );
};

export default RadioGroup;
