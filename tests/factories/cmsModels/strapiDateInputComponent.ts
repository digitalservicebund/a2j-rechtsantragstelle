import { waitFor, screen } from "@testing-library/react";
import type { z } from "zod";
import type { StrapiDateInputComponentSchema } from "~/services/cms/components/StrapiDateInput";
import type { StrapiFieldErrorSchema } from "~/services/cms/models/StrapiFieldError";

export function getStrapiDateInputComponent(
  errorCodes: Array<z.infer<typeof StrapiFieldErrorSchema>>,
): Partial<z.infer<typeof StrapiDateInputComponentSchema>> {
  return {
    __component: "form-elements.date-input",
    name: "myDateInput",
    placeholder: "date input",
    errors: [
      {
        name: "",
        id: 0,
        errorCodes,
      },
    ],
  };
}

export async function expectDateInputErrorToExist(errorText: string) {
  await waitFor(() => {
    expect(screen.getByText(errorText)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("date input")).toHaveClass("has-error");
    expect(screen.getByTestId("inputError")).toBeInTheDocument();
    expect(screen.getByTestId("ErrorOutlineIcon")).toBeInTheDocument();
  });
}
