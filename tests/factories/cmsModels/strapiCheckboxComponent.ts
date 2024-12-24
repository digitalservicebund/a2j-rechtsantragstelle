import { waitFor, screen } from "@testing-library/react";
import type { z } from "zod";
import type { StrapiCheckboxComponentSchema } from "~/services/cms/components/StrapiCheckbox";
import type { StrapiFieldErrorSchema } from "~/services/cms/models/StrapiFieldError";

export function getStrapiCheckboxComponent(
  errorCode: z.infer<typeof StrapiFieldErrorSchema>,
): {
  component: Partial<z.infer<typeof StrapiCheckboxComponentSchema>>;
  expectCheckboxErrorToExist: () => Promise<void>;
} {
  return {
    component: {
      __component: "form-elements.checkbox",
      name: "myCheckbox",
      label: "Checkbox",
      isRequiredError: {
        name: "",
        id: 0,
        errorCodes: [errorCode],
      },
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
