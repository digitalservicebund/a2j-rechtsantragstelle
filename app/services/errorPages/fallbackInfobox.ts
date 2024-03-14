import type { StrapiInfoBoxComponent } from "../cms/models/StrapiInfoBox";

const fallbackStrapiInfoBox = {
  __component: "page.info-box",
  identifier: null,
  heading: null,
  outerBackground: null,
  items: [
    {
      label: { text: "500", look: "ds-label-01-reg", tagName: "div" },
      headline: {
        text: "Unerwarteter Fehler",
        look: "ds-heading-02-reg",
        tagName: "h1",
      },
      image: null,
      content:
        "Leider ist ein Fehler ist aufgetreten. Wir arbeiten ständig an der Verbesserung unserer Service und sind bereits informiert.\n\nBitte versuchen Sie es später noch einmal.",
      buttons: null,
      identifier: null,
    },
  ],
  container: { backgroundColor: null, paddingBottom: null, paddingTop: null },
} satisfies StrapiInfoBoxComponent;

export default fallbackStrapiInfoBox;
