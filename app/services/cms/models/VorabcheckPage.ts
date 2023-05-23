import type { Timestampable } from "./Timestampable";
import type { FormContentCMS } from "./contentComponents";
import type { FormComponentCMS } from "./formComponents";

export interface VorabcheckPage extends Timestampable {
  slug: string;
  meta: {
    id: number;
    title: string;
  };
  pre_form: FormContentCMS[];
  form: FormComponentCMS[];
}
