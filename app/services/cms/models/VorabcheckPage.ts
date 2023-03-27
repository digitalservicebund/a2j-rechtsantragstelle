import type { ContentComponent } from "./contentComponents";
import type { FormComponent } from "./formComponents";

export type VorabcheckPage = {
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  meta: {
    id: number;
    title: string;
  };
  pre_form: ContentComponent[];
  form: FormComponent[];
};
