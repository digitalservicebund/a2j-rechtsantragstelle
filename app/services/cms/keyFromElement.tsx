import type { StrapiContentComponent } from "./models/formElements/StrapiContentComponent";
import type { StrapiFormComponent } from "./models/StrapiFormComponent";

export const keyFromElement = (
  element: StrapiContentComponent | StrapiFormComponent,
) => `${element.__component}_${element.id ?? 0}`;
