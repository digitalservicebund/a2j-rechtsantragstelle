export type Heading = {
  id: number;
  __component: "basic.heading";
  text: string;
  level: number;
  style:
    | "heading-01-reg"
    | "heading-02-reg"
    | "heading-03-reg"
    | "heading-03-bold"
    | "subhead";
};

export type Paragraph = {
  id: number;
  __component: "basic.paragraph";
  text: string;
};

export type FormContentCMS = Heading | Paragraph;
