import type { Heading } from "./Heading";
import type { Paragraph } from "./Paragraph";
import type { Image } from "./basicComponents";
import type { Button } from "./Button";
import type { Background, Container } from "./metaComponents";

export type Header = {
  id: number;
  __component: "page.header";
  heading: Heading;
  content: Paragraph;
  outerBackground?: Background;
  container: Container;
};

export type InfoBox = {
  id: number;
  __component: "page.info-box";
  heading?: Heading;
  items: InfoBoxItem[];
  outerBackground?: Background;
  container: Container;
};

export type InfoBoxItem = {
  id: number;
  __component: "page.info-box-item";
  label?: Heading;
  headline: Heading;
  image?: Image;
  content: string;
  button?: Button;
};

export type Box = {
  id: number;
  __component: "page.box";
  label?: Heading;
  heading?: Heading;
  content?: Paragraph;
  button?: Button;
  outerBackground?: Background;
  container: Container;
};

export type NavigationItem = {
  id: number;
  text: string;
  targeturl: string;
  baseurl: string;
};

export type PageComponentCMS = Header | InfoBox | Box;
