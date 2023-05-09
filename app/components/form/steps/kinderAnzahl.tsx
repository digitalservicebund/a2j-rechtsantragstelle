import { z } from "zod";
import Input from "~/components/Input";
import type { StepComponentProps } from "~/components/form/steps";
import { getInputsContent } from "~/services/cms/getPageConfig";
import { buildKidsCountValidationSchema } from "~/services/validation/kidsCount/buildKidsCountValidationSchema";

const schema = z.object({
  kids6Below: buildKidsCountValidationSchema(),
  kids7To14: buildKidsCountValidationSchema(),
  kids15To18: buildKidsCountValidationSchema(),
  kids18Above: buildKidsCountValidationSchema(),
});

export const kinderAnzahlStep = {
  schema,
  component: ({ content }: StepComponentProps) => {
    const inputElements = getInputsContent(content);

    return (
      <div className="ds-stack-40">
        {inputElements.map((inputElement, idx) => (
          <Input
            key={idx}
            name={inputElement.name}
            label={inputElement.label}
            type={inputElement.type}
            placeholder={inputElement.placeholder}
            errors={inputElement.errors.data}
          />
        ))}
      </div>
    );
  },
};
