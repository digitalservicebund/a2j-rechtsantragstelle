import type { FormContentCms } from "./FormContentCms";
import type { Heading } from "./Heading";
import type { Paragraph } from "./Paragraph";
import type { Link } from "~/services/cms/models/basicComponents";
import type { ElementWithId } from "~/services/cms/models/ElementWithId";
import type {
  RelationOneToMany,
  RelationOneToOne,
} from "~/services/cms/models/commons/concepts";
import type { Timestampable } from "./Timestampable";

export interface ResultPage extends Timestampable {
  slug: string;
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
  freeZone: FormContentCms[];
  nextLink?: Link;
}

export type ResultPageType = "error" | "success" | "warning";
