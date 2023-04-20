import type { FormContentCMS, Heading, Paragraph } from "./contentComponents";
import type { Link } from "~/services/cms/models/basicComponents";

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
  reasoning?: Paragraph[];
  freeZone?: FormContentCMS[];
  nextLink?: Link;
};

export type ResultPageType = "error" | "success" | "warning";
