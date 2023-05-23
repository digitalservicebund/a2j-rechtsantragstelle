import type { FormContentCMS } from "~/services/cms/models/contentComponents";
import type { Localizable } from "./Localizable";
import type { Timestampable } from "./Timestampable";

export interface ElementWithId extends Localizable, Timestampable {
  id?: number;
  elementId: string;
  element: FormContentCMS[];
}
