import { z } from "zod";
import Input from "~/components/Input";
import type { StepComponentProps } from "~/components/form/steps";
import { getInputsContent } from "~/services/cms/getPageConfig";
import { getInputProps } from "~/services/props/getInputProps";
import { buildKidsCountValidationSchema } from "~/services/validation/kidsCount/buildKidsCountValidationSchema";

const schema = z.object({
  kids6Below: buildKidsCountValidationSchema(),
  kids7To14: buildKidsCountValidationSchema(),
  kids15To18: buildKidsCountValidationSchema(),
  kids18Above: buildKidsCountValidationSchema(),
});

export const kinderAnzahlStep = {
  schema,
  component: ({ content, defaultValues }: StepComponentProps) => {
    const inputElements = getInputsContent(content);

    return (
      <div className="ds-stack-40">
        {inputElements.map((inputElement) => (
          <Input
            {...getInputProps(inputElement)}
            key={inputElement.name}
            defaultValue={defaultValues?.[inputElement.name] || "0"}
          />
        ))}
      </div>
    );
  },
};
