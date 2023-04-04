export type Heading = {
  id: number;
  __component: "basic.heading";
  text: string;
  level: number;
  className?: string;
};
export type Paragraph = {
  id: number;
  __component: "basic.paragraph";
  text: string;
};

export type FormContentCMS = Heading | Paragraph;
