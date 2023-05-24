import type { Timestampable } from "./Timestampable";
import type { FormContentCms } from "./FormContentCms";

export interface Page extends Timestampable {
  slug: string;
  meta: {
    title: string;
  };
  content: FormContentCms[];
}
