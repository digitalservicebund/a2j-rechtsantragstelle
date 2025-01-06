import { waitFor, screen } from "@testing-library/react";
import type { z } from "zod";
import type { StrapiDropdownComponentSchema } from "~/services/cms/components/StrapiDropdown";
import type { StrapiFieldErrorSchema } from "~/services/cms/models/StrapiFieldError";

export function getStrapiDropdownComponent(
  errorCode: z.infer<typeof StrapiFieldErrorSchema>,
): {
  component: Partial<z.infer<typeof StrapiDropdownComponentSchema>>;
  expectDropdownErrorToExist: () => Promise<void>;
} {
  return {
    component: {
      __component: "form-elements.dropdown",
      name: `myDropdown`,
      placeholder: "Select a value.",
      options: [
        {
          text: "Option 1",
          value: "option1",
        },
        {
          text: "Option 2",
          value: "option2",
        },
        {
          text: "Option 3",
          value: "option3",
        },
      ],
      errors: [
        {
          name: "",
          id: 0,
          errorCodes: [errorCode],
        },
      ],
    },
    expectDropdownErrorToExist: async function () {
      await waitFor(() => {
        expect(screen.getByText(errorCode.text)).toBeInTheDocument();
        expect(screen.getByTestId("inputError")).toBeInTheDocument();
        expect(screen.getByTestId("ErrorOutlineIcon")).toBeInTheDocument();
      });
    },
  };
}
