import type { Timestampable } from "./Timestampable";
import type { FormContentCms } from "./FormContentCms";
import type { FormComponentCms } from "./FormComponentCms";

export interface VorabcheckPage extends Timestampable {
  slug: string;
  meta: {
    id: number;
    title: string;
  };
  pre_form: FormContentCms[];
  form: FormComponentCms[];
}
