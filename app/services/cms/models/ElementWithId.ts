import type { FormContentCms } from "~/services/cms/models/FormContentCms";
import type { Localizable } from "./Localizable";
import type { Timestampable } from "./Timestampable";

export interface ElementWithId extends Localizable, Timestampable {
  id?: number;
  elementId: string;
  element: FormContentCms[];
}
