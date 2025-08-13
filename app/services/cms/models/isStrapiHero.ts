import { type z } from "zod";
import { type StrapiHeroSchema } from "./content/StrapiHero";
import { type StrapiContentComponent } from "./StrapiContentComponent";

type StrapiHeaderComponent = z.infer<typeof StrapiHeroSchema>;

export const isStrapiHero = (
  content: StrapiContentComponent,
): content is StrapiHeaderComponent => content.__component === "page.hero";
