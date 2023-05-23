import type { FormContentCMS } from "~/services/cms/models/contentComponents";
import type { Localizable } from "./Localizable";

export interface ElementWithId extends Localizable {
  id?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  elementId: string;
  element: FormContentCMS[];
}
