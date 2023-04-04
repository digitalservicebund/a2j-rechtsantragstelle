import type { Heading, Paragraph } from "./contentComponents";

export type Header = {
  id: number;
  __component: "page.header";
  header: Heading;
  description: Paragraph;
  hasBackground: boolean;
};

export type PageComponentCMS = Header;
