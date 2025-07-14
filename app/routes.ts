import {
  type RouteConfig,
  route,
  index,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("*", "routes/$.tsx", { id: "index" }),

  route("error/:code", "routes/error.$code.tsx"),

  route("datenschutz", "routes/datenschutz.tsx"),
  route("feedback/erfolgreich", "routes/feedback.erfolgreich.tsx"),
  route("hilfe", "routes/hilfe.tsx"),
  route("opensource", "routes/opensource.tsx"),
  route(
    "persoenliche-daten-loeschen",
    "routes/persoenliche-daten-loeschen.tsx",
  ),
  route("schuldenforschung", "routes/schuldenforschung.tsx"),
  route("link/*", "routes/link.$.tsx"),
  route("health", "routes/health.ts"),
  route("robots.txt", "routes/robots[.]txt.tsx"),

  route("kitchensink", "routes/kitchensink._index.tsx"),
  route("kitchensink/buttons", "routes/kitchensink.buttons.tsx"),

  route("api/airlines/list", "routes/api.airlines.list.ts"),
  route("api/airports/list", "routes/api.airports.list.ts"),
  route("api/streetNames/list/:PLZ", "routes/api.streetNames.list.$PLZ.ts"),

  route("action/delete-array-item", "routes/action.delete-array-item.ts"),
  route("action/send-email", "routes/action.send-email.ts"),
  route("action/send-rating", "routes/action.send-rating.ts"),
  route("action/set-analytics", "routes/action.set-analytics.tsx"),
  route("action/send-feedback", "routes/action.send-feedback.ts"),
  route("action/delete-data", "routes/action.delete-data.tsx"),

  ...prefix("beratungshilfe", [
    route("vorabcheck", "routes/beratungshilfe.vorabcheck._index.tsx"),
    route("vorabcheck/*", "routes/beratungshilfe.vorabcheck.$.tsx"),
    route(
      "vorabcheck/ergebnis/*",
      "routes/beratungshilfe.vorabcheck.ergebnis.$.tsx",
    ),
    route(
      "vorabcheck/visualisierung",
      "routes/beratungshilfe.vorabcheck.visualisierung.tsx",
    ),
    route("antrag", "routes/beratungshilfe.antrag._index.tsx"),
    route("antrag/*", "routes/beratungshilfe.antrag.$.tsx"),
    route(
      "antrag/download.pdf",
      "routes/beratungshilfe.antrag.download.pdf.tsx",
    ),
    route(
      "antrag/visualisierung",
      "routes/beratungshilfe.antrag.visualisierung.tsx",
    ),
    route("prozesskostenhilfe", "routes/beratungshilfe.prozesskostenhilfe.ts"),
    route(
      "zustaendiges-gericht",
      "routes/beratungshilfe.zustaendiges-gericht._index.tsx",
    ),
    route(
      "zustaendiges-gericht/suche",
      "routes/beratungshilfe.zustaendiges-gericht.suche.tsx",
    ),
    route(
      "zustaendiges-gericht/auswahl/:PLZ",
      "routes/beratungshilfe.zustaendiges-gericht.auswahl.$PLZ.tsx",
    ),
    route(
      "zustaendiges-gericht/ergebnis/*",
      "routes/beratungshilfe.zustaendiges-gericht.ergebnis.$.tsx",
    ),
  ]),

  ...prefix("fluggastrechte", [
    route("vorabcheck/*", "routes/fluggastrechte.vorabcheck.$.tsx"),
    route(
      "vorabcheck/ergebnis/*",
      "routes/fluggastrechte.vorabcheck.ergebnis.$.tsx",
    ),
    route(
      "vorabcheck/visualisierung",
      "routes/fluggastrechte.vorabcheck.visualisierung.tsx",
    ),
    route("formular/*", "routes/fluggastrechte.formular.$.tsx"),
    route(
      "formular/download.pdf",
      "routes/fluggastrechte.formular.download.pdf.ts",
    ),
    route(
      "formular/intro/redirect-vorabcheck-ergebnis",
      "routes/fluggastrechte.formular.intro.redirect-vorabcheck-ergebnis.tsx",
    ),
    route(
      "formular/redirect-to-vorabcheck",
      "routes/fluggastrechte.formular.redirect-to-vorabcheck.tsx",
    ),
    route(
      "formular/visualisierung",
      "routes/fluggastrechte.formular.visualisierung.tsx",
    ),
  ]),

  ...prefix("geld-einklagen", [
    route("vorabcheck/*", "routes/geld-einklagen.vorabcheck.$.tsx"),
    route(
      "vorabcheck/ergebnis/*",
      "routes/geld-einklagen.vorabcheck.ergebnis.$.tsx",
    ),
    route(
      "vorabcheck/partnergericht/ergebnis/*",
      "routes/geld-einklagen.vorabcheck.partnergericht.ergebnis.$.tsx",
    ),
    route(
      "vorabcheck/visualisierung",
      "routes/geld-einklagen.vorabcheck.visualisierung.tsx",
    ),
    route("formular/*", "routes/geld-einklagen.formular.$.tsx"),
    route(
      "formular/visualisierung",
      "routes/geld-einklagen.formular.visualisierung.tsx",
    ),
  ]),

  ...prefix("kontopfaendung", [
    route("wegweiser/*", "routes/kontopfaendung.wegweiser.$.tsx"),
    route(
      "wegweiser/ergebnis/*",
      "routes/kontopfaendung.wegweiser.ergebnis.$.tsx",
    ),
  ]),

  ...prefix("prozesskostenhilfe", [
    route("formular", "routes/prozesskostenhilfe.formular._index.tsx"),
    route("formular/*", "routes/prozesskostenhilfe.formular.$.tsx"),
    route(
      "formular/download.pdf",
      "routes/prozesskostenhilfe.formular.download.pdf.tsx",
    ),
  ]),
] satisfies RouteConfig;
