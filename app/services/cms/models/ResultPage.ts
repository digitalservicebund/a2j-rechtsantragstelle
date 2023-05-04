import type { FormContentCMS, Heading, Paragraph } from "./contentComponents";
import type { Link } from "~/services/cms/models/basicComponents";
import type { ElementWithId } from "~/services/cms/models/ElementWithId";
import type {
  RelationOneToMany,
  RelationOneToOne,
} from "~/services/cms/models/commons/concepts";

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
  reasonings: RelationOneToMany<ElementWithId>;
  documents: RelationOneToOne<ElementWithId>;
  nextSteps: RelationOneToOne<ElementWithId>;
  freeZone: FormContentCMS[];
  nextLink?: Link;
};

export type ResultPageType = "error" | "success" | "warning";
