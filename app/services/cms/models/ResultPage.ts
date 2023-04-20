import type { FormContentCMS, Heading, Paragraph } from "./contentComponents";

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
};

export type ResultPageType = "error" | "success" | "warning";
