import type { FormContentCMS } from "~/services/cms/models/contentComponents";

export type ElementWithId = {
  id?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  elementId: string;
  element: FormContentCMS[];
};
