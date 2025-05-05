import { type z } from "zod";
import { type StrapiContentComponent } from "./StrapiContentComponent";
import { type StrapiHeroSchema } from "./StrapiHero";

type StrapiHeaderComponent = z.infer<typeof StrapiHeroSchema>;

export const isStrapiHero = (
  content: StrapiContentComponent,
): content is StrapiHeaderComponent => content.__component === "page.hero";
