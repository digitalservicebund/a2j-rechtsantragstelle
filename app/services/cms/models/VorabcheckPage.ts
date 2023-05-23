import type { Timestampable } from "./Timestampable";
import type { FormContentCMS } from "./contentComponents";
import type { FormComponentCms } from "./FormComponentCms";

export interface VorabcheckPage extends Timestampable {
  slug: string;
  meta: {
    id: number;
    title: string;
  };
  pre_form: FormContentCMS[];
  form: FormComponentCms[];
}
