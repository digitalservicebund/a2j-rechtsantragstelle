import type { CardGroupItem } from "~/components/content/card/Card";
import { pagesTranslations } from "~/services/translations/pages";

export const serviceCards: CardGroupItem[] = [
  {
    span: 4,
    link: "/geld-einklagen",
    id: "geld-einklagen-card",
    preline: pagesTranslations.homepage.cardPrelineTGA.de,
    heading: pagesTranslations.homepage.cardHeadingTGA.de,
    description: pagesTranslations.homepage.cardDescriptionTGA.de,
    buttonLabel: pagesTranslations.homepage.cardButtonLabelTGA.de,
  },
  {
    span: 4,
    link: "/fluggastrechte",
    id: "fluggastrechte-card",
    preline: pagesTranslations.homepage.cardPrelineFGR.de,
    heading: pagesTranslations.homepage.cardHeadingFGR.de,
    description: pagesTranslations.homepage.cardDescriptionFGR.de,
    buttonLabel: pagesTranslations.homepage.cardButtonLabelFGR.de,
  },
  {
    span: 4,
    link: "/beratungshilfe",
    id: "beratungshilfe-card",
    preline: pagesTranslations.homepage.cardPrelineBerH.de,
    heading: pagesTranslations.homepage.cardHeadingBerH.de,
    description: pagesTranslations.homepage.cardDescriptionBerH.de,
    buttonLabel: pagesTranslations.homepage.cardButtonLabelBerH.de,
  },
  {
    span: 4,
    link: "/prozesskostenhilfe",
    id: "prozesskostenhilfe-card",
    preline: pagesTranslations.homepage.cardPrelinePKH.de,
    heading: pagesTranslations.homepage.cardHeadingPKH.de,
    description: pagesTranslations.homepage.cardDescriptionPKH.de,
    buttonLabel: pagesTranslations.homepage.cardButtonLabelPKH.de,
  },
  {
    span: 4,
    link: "/kontopfaendung",
    id: "kontopfaendung-card",
    preline: pagesTranslations.homepage.cardPrelineKontopfaendung.de,
    heading: pagesTranslations.homepage.cardHeadingKontopfaendung.de,
    description: pagesTranslations.homepage.cardDescriptionKontopfaendung.de,
    buttonLabel: pagesTranslations.homepage.cardButtonLabelKontopfaendung.de,
  },
  {
    span: 4,
    link: "/nachlass/erbschein",
    id: "erbschein-card",
    preline: pagesTranslations.homepage.cardPrelineErbschein.de,
    heading: pagesTranslations.homepage.cardHeadingErbschein.de,
    description: pagesTranslations.homepage.cardDescriptionErbschein.de,
    buttonLabel: pagesTranslations.homepage.cardButtonLabelErbschein.de,
  },
];

export const infoCards: CardGroupItem[] = [
  {
    span: 6,
    link: "/mein-Justizpostfach-einrichten",
    id: "mein-justizpostfach-einrichten-card",
    preline: pagesTranslations.homepage.cardPrelineAnleitung.de,
    heading: pagesTranslations.homepage.cardHeadingAnleitung.de,
    description: pagesTranslations.homepage.cardDescriptionAnleitung.de,
    buttonLabel: pagesTranslations.homepage.cardButtonLabelAnleitung.de,
  },
  {
    span: 6,
    link: "/finanzielle-hilfen",
    id: "finanzielle-hilfen-card",
    preline: pagesTranslations.homepage.cardPrelineRechtsprobleme.de,
    heading: pagesTranslations.homepage.cardHeadingRechtsprobleme.de,
    description: pagesTranslations.homepage.cardDescriptionRechtsprobleme.de,
    buttonLabel: pagesTranslations.homepage.cardButtonLabelRechtsprobleme.de,
  },
];

export const feedbackCard: CardGroupItem[] = [
  {
    span: 6,
    link: "/feedback",
    id: "studie-card",
    preline: pagesTranslations.homepage.cardPrelineStudie.de,
    heading: pagesTranslations.homepage.cardHeadingStudie.de,
    description: pagesTranslations.homepage.cardDescriptionStudie.de,
    buttonLabel: pagesTranslations.homepage.cardButtonLabelStudie.de,
  },
];
