export type Heading = {
  id: number;
  __component: "basic.heading";
  text: string;
  level: number;
  style:
    | "ds-heading-01-reg"
    | "ds-heading-02-reg"
    | "ds-heading-03-reg"
    | "ds-heading-03-bold"
    | "subhead";
};

export type Paragraph = {
  id: number;
  __component: "basic.paragraph";
  text: string;
};

export type FormContentCMS = Heading | Paragraph;
