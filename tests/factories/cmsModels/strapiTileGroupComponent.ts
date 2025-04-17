import { waitFor, screen } from "@testing-library/react";
import type { z } from "zod";
import type { StrapiTileGroupComponentSchema } from "~/services/cms/components/StrapiTileGroup";
import type { StrapiFieldErrorSchema } from "~/services/cms/models/StrapiFieldError";

export function getStrapiTileGroupComponent(
  errorCode: z.infer<typeof StrapiFieldErrorSchema>,
  tiles: string[] = ["Tile 1"],
): {
  component: Partial<z.infer<typeof StrapiTileGroupComponentSchema>>;
  expectTileGroupErrorToExist: () => Promise<void>;
} {
  return {
    component: {
      __component: "form-elements.tile-group",
      name: "myTileGroup",
      options: tiles.map((title, index) => ({
        title,
        value: `tile ${index}`,
        description: null,
        tagDescription: null,
      })),
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
