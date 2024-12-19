import { waitFor, screen } from "@testing-library/react";
import type { z } from "zod";
import type { StrapiFieldErrorSchema } from "~/services/cms/models/StrapiFieldError";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { uppercaseFirstLetter } from "~/util/strings";

export enum StrapiInputType {
  Date = "date",
  Time = "time",
}

export function getStrapiInputComponent(
  errorCode: z.infer<typeof StrapiFieldErrorSchema>,
  type?: StrapiInputType,
) {
  const componentTypes: Record<
    StrapiInputType,
    StrapiFormComponent["__component"]
  > = {
    [StrapiInputType.Date]: "form-elements.date-input",
    [StrapiInputType.Time]: "form-elements.time-input",
  };

  return {
    component: {
      __component: type ? componentTypes[type] : "form-elements.input",
      name: `my${type ? uppercaseFirstLetter(type) : ""}Input`,
      placeholder: `${type ? type + " " : ""}input`,
      errors: [
        {
          name: "",
          id: 0,
          errorCodes: [errorCode],
        },
      ],
    } as StrapiFormComponent,
    expectInputErrorToExist: async function () {
      await waitFor(() => {
        expect(screen.getByText(errorCode.text)).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText(`${type ? type + " " : ""}input`),
        ).toHaveClass("has-error");
        expect(screen.getByTestId("inputError")).toBeInTheDocument();
        expect(screen.getByTestId("ErrorOutlineIcon")).toBeInTheDocument();
      });
    },
  };
}
