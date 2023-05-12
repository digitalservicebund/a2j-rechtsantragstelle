import type { Image, Link } from "~/services/cms/models/basicComponents";
import type { Paragraph } from "~/services/cms/models/contentComponents";
import type { NavigationItem } from "~/services/cms/models/pageComponents";
import type { RelationOneToOne } from "~/services/cms/models/commons/concepts";

export type Footer = {
  image: RelationOneToOne<Image>;
  paragraphs: Paragraph[];
  links: Link[];
};

export type Navigation = {
  locale: "de";
  tree: NavigationItem[];
};

export type SingleComponentCMS = Footer | Navigation;
