import type { FormContentCMS, Heading, Paragraph } from "./contentComponents";
import type { Link } from "~/services/cms/models/basicComponents";
import type { ElementWithId } from "~/services/cms/models/ElementWithId";

export type ResultPage = {
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  meta: {
    id: number;
    title: string;
  };
  pageType: ResultPageType;
  heading: Heading;
  hintText?: Paragraph;
  linkText?: string;
  reasonings: { data?: ElementWithId[] };
  documents: { data?: ElementWithId };
  nextSteps: { data?: ElementWithId };
  freeZone: FormContentCMS[];
  nextLink?: Link;
};

export type ResultPageType = "error" | "success" | "warning";
