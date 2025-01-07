import { waitFor, screen } from "@testing-library/react";
import type { z } from "zod";
import type { StrapiTextareaComponentSchema } from "~/services/cms/components/StrapiTextarea";
import type { StrapiFieldErrorSchema } from "~/services/cms/models/StrapiFieldError";

export function getStrapiTextareaComponent(
  errorCode: z.infer<typeof StrapiFieldErrorSchema>,
): {
  component: Partial<z.infer<typeof StrapiTextareaComponentSchema>>;
  expectTextareaErrorToExist: () => Promise<void>;
} {
  return {
    component: {
      __component: "form-elements.textarea",
      name: `myTextarea`,
      placeholder: `textarea`,
      errors: [
        {
          name: "",
          id: 0,
          errorCodes: [errorCode],
        },
      ],
    },
    expectTextareaErrorToExist: async function () {
      await waitFor(() => {
        expect(screen.getByText(errorCode.text)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(`textarea`)).toHaveClass(
          "has-error",
        );
        expect(screen.getByTestId("inputError")).toBeInTheDocument();
        expect(screen.getByTestId("ErrorOutlineIcon")).toBeInTheDocument();
      });
    },
  };
}
