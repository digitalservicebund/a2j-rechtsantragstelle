import { translations } from "~/services/translations/translations";
import type { CardGroupItem } from "~/components/content/card/Card";

export const serviceCards: CardGroupItem[] = [
  {
    span: 4,
    link: "/geld-einklagen",
    id: "geld-einklagen-card",
    preline: translations.homepage.cardPrelineTGA.de,
    heading: translations.homepage.cardHeadingTGA.de,
    description: translations.homepage.cardDescriptionTGA.de,
    buttonLabel: translations.homepage.cardButtonLabelTGA.de,
  },
  {
    span: 4,
    link: "/fluggastrechte",
    id: "fluggastrechte-card",
    preline: translations.homepage.cardPrelineFGR.de,
    heading: translations.homepage.cardHeadingFGR.de,
    description: translations.homepage.cardDescriptionFGR.de,
    buttonLabel: translations.homepage.cardButtonLabelFGR.de,
  },
  {
    span: 4,
    link: "/beratungshilfe",
    id: "beratungshilfe-card",
    preline: translations.homepage.cardPrelineBerH.de,
    heading: translations.homepage.cardHeadingBerH.de,
    description: translations.homepage.cardDescriptionBerH.de,
    buttonLabel: translations.homepage.cardButtonLabelBerH.de,
  },
  {
    span: 4,
    link: "/prozesskostenhilfe",
    id: "prozesskostenhilfe-card",
    preline: translations.homepage.cardPrelinePKH.de,
    heading: translations.homepage.cardHeadingPKH.de,
    description: translations.homepage.cardDescriptionPKH.de,
    buttonLabel: translations.homepage.cardButtonLabelPKH.de,
  },
  {
    span: 4,
    link: "/kontopfaendung",
    id: "kontopfaendung-card",
    preline: translations.homepage.cardPrelineKontopfaendung.de,
    heading: translations.homepage.cardHeadingKontopfaendung.de,
    description: translations.homepage.cardDescriptionKontopfaendung.de,
    buttonLabel: translations.homepage.cardButtonLabelKontopfaendung.de,
  },
];

export const lebenslagenCards: CardGroupItem[] = [
  {
    span: 6,
    link: "/finanzielle-hilfen",
    id: "finanzielle-hilfen-card",
    preline: translations.homepage.cardPrelineRechtsprobleme.de,
    heading: translations.homepage.cardHeadingRechtsprobleme.de,
    description: translations.homepage.cardDescriptionRechtsprobleme.de,
    buttonLabel: translations.homepage.cardButtonLabelRechtsprobleme.de,
    cardStyleOverrides: "bg-kern-darkblue-050!",
  },
  {
    span: 6,
    link: "/nachlass",
    id: "nachlass-card",
    preline: translations.homepage.cardPrelineNachlass.de,
    heading: translations.homepage.cardHeadingNachlass.de,
    description: translations.homepage.cardDescriptionNachlass.de,
    buttonLabel: translations.homepage.cardButtonLabelNachlass.de,
    cardStyleOverrides: "bg-kern-darkblue-050!",
  },
];

export const infoCards: CardGroupItem[] = [
  {
    span: 6,
    link: "/mein-Justizpostfach-einrichten",
    id: "mein-justizpostfach-einrichten-card",
    preline: translations.homepage.cardPrelineAnleitung.de,
    heading: translations.homepage.cardHeadingAnleitung.de,
    description: translations.homepage.cardDescriptionAnleitung.de,
    buttonLabel: translations.homepage.cardButtonLabelAnleitung.de,
  },
];

export const feedbackCard: CardGroupItem[] = [
  {
    span: 6,
    link: "/feedback",
    id: "studie-card",
    preline: translations.homepage.cardPrelineStudie.de,
    heading: translations.homepage.cardHeadingStudie.de,
    description: translations.homepage.cardDescriptionStudie.de,
    buttonLabel: translations.homepage.cardButtonLabelStudie.de,
  },
];
