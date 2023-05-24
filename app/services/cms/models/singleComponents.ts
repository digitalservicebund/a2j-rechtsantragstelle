import type { Image } from "~/services/cms/models/Image";
import type { Paragraph } from "~/services/cms/models/Paragraph";
import type { Link } from "~/services/cms/models/Link";
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
