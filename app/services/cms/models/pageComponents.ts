import type { Heading, Paragraph } from "./contentComponents";
import type { Image } from "./basicComponents";

export type Header = {
  id: number;
  __component: "page.header";
  header: Heading;
  description: Paragraph;
  hasBackground: boolean;
};

export type InfoBox = {
  id: number;
  __component: "page.info-box";
  items: InfoBoxItem[];
  headline: Heading;
};

export type InfoBoxItem = {
  id: number;
  __component: "page.info-box-item";
  label?: string;
  headline: string;
  image?: Image;
  content: string;
};

export type PageComponentCMS = Header | InfoBox;
