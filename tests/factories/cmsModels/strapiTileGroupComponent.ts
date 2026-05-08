import type { z } from "zod";
import type { StrapiTileGroupComponentSchema } from "~/services/cms/models/formElements/StrapiTileGroup";
import type { StrapiFieldErrorSchema } from "~/services/cms/models/StrapiFieldError";

export function getStrapiTileGroupComponent(
  errorCode: z.infer<typeof StrapiFieldErrorSchema>,
  tiles: string[] = ["Tile 1"],
): {
  component: Partial<z.infer<typeof StrapiTileGroupComponentSchema>>;
} {
  return {
    component: {
      __component: "form-elements.tile-group",
      name: "myTileGroup",
      options: tiles.map((title, index) => ({
        title,
        value: `tile ${index}`,
        description: undefined,
      })),
      errorMessages: [errorCode],
    },
  };
}
