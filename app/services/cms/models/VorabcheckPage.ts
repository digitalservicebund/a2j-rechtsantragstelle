import type { FormContentCMS } from "./contentComponents";
import type { FormComponentCMS } from "./formComponents";

export type VorabcheckPage = {
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  meta: {
    id: number;
    title: string;
  };
  pre_form: FormContentCMS[];
  form: FormComponentCMS[];
};
