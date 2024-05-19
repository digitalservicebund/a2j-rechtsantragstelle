import type { StrapiContentComponent } from "./models/StrapiContentComponent";
import type { StrapiFormComponent } from "./models/StrapiFormComponent";

export const keyFromElement = (
  element: StrapiContentComponent | StrapiFormComponent,
) => `${element.__component}_${element.id ?? 0}`;
