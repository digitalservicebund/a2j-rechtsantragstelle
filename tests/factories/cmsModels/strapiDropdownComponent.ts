import type { z } from "zod";
import type { StrapiDropdownComponentSchema } from "~/services/cms/models/formElements/StrapiDropdown";
import type { StrapiFieldErrorSchema } from "~/services/cms/models/StrapiFieldError";

export function getStrapiDropdownComponent(
  errorCode: z.infer<typeof StrapiFieldErrorSchema>,
): {
  component: Partial<z.infer<typeof StrapiDropdownComponentSchema>>;
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
          preSelected: false,
        },
        {
          text: "Option 2",
          value: "option2",
          preSelected: false,
        },
        {
          text: "Option 3",
          value: "option3",
          preSelected: false,
        },
      ],
      errorMessages: [errorCode],
    },
  };
}
