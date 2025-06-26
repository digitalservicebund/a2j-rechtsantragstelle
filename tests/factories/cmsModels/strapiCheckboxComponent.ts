import { waitFor, screen } from "@testing-library/react";
import type { z } from "zod";
import type { StrapiCheckboxComponentSchema } from "~/services/cms/components/StrapiCheckbox";
import type { StrapiFieldErrorSchema } from "~/services/cms/models/StrapiFieldError";

type CheckboxConfig = {
  name?: string;
  label?: string;
  id?: number;
};

export function getStrapiCheckboxComponent(
  errorCode: z.infer<typeof StrapiFieldErrorSchema>,
  config: CheckboxConfig = {},
): {
  component: Partial<z.infer<typeof StrapiCheckboxComponentSchema>>;
  expectCheckboxErrorToExist: () => Promise<void>;
} {
  const name = config.name ?? "myCheckbox";
  const label = config.label ?? "Checkbox";
  const id = config.id ?? 0;

  return {
    component: {
      __component: "form-elements.checkbox",
      name,
      label,
      id,
      errorMessage: errorCode.text,
    },
    expectCheckboxErrorToExist: async function () {
      await waitFor(() => {
        expect(screen.getByText(errorCode.text)).toBeInTheDocument();
        expect(screen.getByTestId("inputError")).toBeInTheDocument();
        expect(screen.getByTestId("ErrorOutlineIcon")).toBeInTheDocument();
      });
    },
  };
}
