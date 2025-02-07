import { waitFor, screen } from "@testing-library/react";
import type { z } from "zod";
import type { StrapiTileGroupComponentSchema } from "~/services/cms/components/StrapiTileGroup";
import type { StrapiFieldErrorSchema } from "~/services/cms/models/StrapiFieldError";

export function getStrapiTileGroupComponent(
  errorCode: z.infer<typeof StrapiFieldErrorSchema>,
): {
  component: Partial<z.infer<typeof StrapiTileGroupComponentSchema>>;
  expectTileGroupErrorToExist: () => Promise<void>;
} {
  return {
    component: {
      __component: "form-elements.tile-group",
      name: "myTileGroup",
      options: [
        {
          title: "Tile 1",
          value: "tile1",
          description: null,
          tagDescription: null,
          image: null,
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
    expectTileGroupErrorToExist: async function () {
      await waitFor(() => {
        expect(screen.getByText(errorCode.text)).toBeInTheDocument();
        expect(screen.getByTestId("inputError")).toBeInTheDocument();
        expect(screen.getByTestId("ErrorOutlineIcon")).toBeInTheDocument();
      });
    },
  };
}
