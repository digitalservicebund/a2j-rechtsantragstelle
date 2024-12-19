import { waitFor, screen } from "@testing-library/react";
import type { z } from "zod";
import type { StrapiInputComponentSchema } from "~/services/cms/components/StrapiInput";
import type { StrapiFieldErrorSchema } from "~/services/cms/models/StrapiFieldError";

export function getStrapiInputComponent(
  errorCodes: Array<z.infer<typeof StrapiFieldErrorSchema>>,
): Partial<z.infer<typeof StrapiInputComponentSchema>> {
  return {
    __component: "form-elements.input",
    name: "myInput",
    placeholder: "input",
    errors: [
      {
        name: "",
        id: 0,
        errorCodes,
      },
    ],
  };
}

export async function expectInputErrorToExist(errorText: string) {
  await waitFor(() => {
    expect(screen.getByText(errorText)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("input")).toHaveClass("has-error");
    expect(screen.getByTestId("inputError")).toBeInTheDocument();
    expect(screen.getByTestId("ErrorOutlineIcon")).toBeInTheDocument();
  });
}
