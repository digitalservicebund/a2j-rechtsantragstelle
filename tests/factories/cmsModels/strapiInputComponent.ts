import { waitFor, screen } from "@testing-library/react";
import type { z } from "zod";
import type { StrapiFieldErrorSchema } from "~/services/cms/models/StrapiFieldError";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";

type InputType = "date" | "time" | "input";

const componentNameMap = {
  date: "form-elements.date-input",
  time: "form-elements.time-input",
  input: "form-elements.input",
} as const satisfies Record<InputType, StrapiFormComponent["__component"]>;

export function getStrapiInputComponent<T extends InputType = "input">(
  errorCode: z.infer<typeof StrapiFieldErrorSchema>,
  type: T = "input" as T,
) {
  return {
    component: {
      __component: componentNameMap[type],
      name: "inputName",
      label: "inputLabel",
      placeholder: "placeholder",
      errors: [{ name: "", id: 0, errorCodes: [errorCode] }],
    },
    expectInputErrorToExist: async function () {
      await waitFor(() => {
        expect(screen.getByText(errorCode.text)).toBeInTheDocument();
        expect(screen.getByRole("textbox")).toHaveClass("has-error");
        expect(screen.getByTestId("inputError")).toBeInTheDocument();
        expect(screen.getByTestId("ErrorOutlineIcon")).toBeInTheDocument();
      });
    },
  };
}
