import { waitFor, screen } from "@testing-library/react";
import type { z } from "zod";
import type { StrapiFieldErrorSchema } from "~/services/cms/models/StrapiFieldError";

export function getStrapiAutoSuggestionInputComponent(
  errorCode: z.infer<typeof StrapiFieldErrorSchema>,
) {
  return {
    component: {
      __component: "form-elements.auto-suggest-input" as const,
      name: "inputName",
      label: "inputLabel",
      placeholder: "placeholder",
      errorMessages: [errorCode],
      isDisabled: false,
    },
    expectInputErrorToExist: async function () {
      await waitFor(() => {
        expect(screen.getByText(errorCode.text)).toBeInTheDocument();
        expect(screen.getByTestId("inputError")).toBeInTheDocument();
        expect(screen.getByTestId("icon-emergency-home")).toBeInTheDocument();
      });
    },
  };
}
