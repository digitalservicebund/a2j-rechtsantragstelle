import type { Timestampable } from "./Timestampable";
import type { FormContentCMS } from "./contentComponents";

export interface Page extends Timestampable {
  slug: string;
  meta: {
    title: string;
  };
  content: FormContentCMS[];
}
