import { waitFor, screen } from "@testing-library/react";
import type { z } from "zod";
import type { StrapiSelectComponentSchema } from "~/services/cms/components/StrapiSelect";
import type { StrapiFieldErrorSchema } from "~/services/cms/models/StrapiFieldError";

export function getStrapiSelectComponent(
  errorCode: z.infer<typeof StrapiFieldErrorSchema>,
): {
  component: Partial<z.infer<typeof StrapiSelectComponentSchema>>;
  expectSelectErrorToExist: () => Promise<void>;
} {
  return {
    component: {
      __component: "form-elements.select",
      name: `mySelect`,
      options: [
        {
          text: "Ja",
          value: "yes",
        },
        {
          text: "Nein",
          value: "no",
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
    expectSelectErrorToExist: async function () {
      await waitFor(() => {
        expect(screen.getByText(errorCode.text)).toBeInTheDocument();
        expect(screen.getByTestId("inputError")).toBeInTheDocument();
        expect(screen.getByTestId("ErrorOutlineIcon")).toBeInTheDocument();
      });
    },
  };
}
