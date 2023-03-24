import { z } from "zod";
import Input from "~/components/Input";
import type { StepComponentProps } from "~/components/form/steps";
import type { InputContent } from "~/services/cms/getPageConfig";

const schema = z.object({
  kids6Below: z.coerce.number().min(0, "min0").default(0),
  kids7To14: z.coerce.number().min(0, "min0").default(0),
  kids15To18: z.coerce.number().min(0, "min0").default(0),
  kids18Above: z.coerce.number().min(0, "min0").default(0),
});
// TODO: empty input defaults to 0 - fill in 0? layout?

export const kidsCountStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const inputElements = content.filter(
      (el) => el.__component === "form-elements.input"
    ) as InputContent[];

    return (
      <div>
        {inputElements.map((inputElement, idx) => (
          <Input
            key={idx}
            name={inputElement.name}
            label={inputElement.label}
            type={inputElement.type}
            errors={inputElement.errors}
            step="any" // decimals for partial custody
          />
        ))}
      </div>
    );
  },
};
