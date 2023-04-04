import type { FormContentCMS } from "./contentComponents";

export type Page = {
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  meta: {
    title: string;
  };
  content: FormContentCMS[];
};
