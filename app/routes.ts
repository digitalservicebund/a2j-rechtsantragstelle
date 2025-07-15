import {
  route,
  index,
  prefix,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("*", "routes/$.tsx"),

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
    route("prozesskostenhilfe", "routes/beratungshilfe.prozesskostenhilfe.ts"), // redirect

    ...prefix("vorabcheck", [
      index("services/flow/server/lastStep.ts", { id: "indexBHV" }),
      route("visualisierung", "routes/shared/visualisierung.ts", {
        id: "visBHV ",
      }),
      route("*", "routes/shared/vorabcheck.ts", { id: "flowBHV" }),
      route("ergebnis/*", "routes/shared/result.ts", { id: "resBHV" }),
    ]),
    ...prefix("antrag", [
      index("services/flow/server/lastStep.ts", { id: "indexBHA" }),
      route("visualisierung", "routes/shared/visualisierung.ts", {
        id: "visBHA",
      }),
      route("download/pdf", "routes/shared/pdfDownloadLoader.ts", {
        id: "pdfBHA",
      }),
      route("*", "routes/shared/formular.ts", { id: "flowBHA" }),
    ]),
    ...prefix("zustaendiges-gericht", [
      index("routes/beratungshilfe.zustaendiges-gericht._index.tsx"),
      route("suche", "routes/beratungshilfe.zustaendiges-gericht.suche.tsx"),
      route(
        "ergebnis/*",
        "routes/beratungshilfe.zustaendiges-gericht.ergebnis.$.tsx",
      ),
      route(
        "auswahl/:PLZ",
        "routes/beratungshilfe.zustaendiges-gericht.auswahl.$PLZ.tsx",
      ),
    ]),
  ]),
  ...prefix("prozesskostenhilfe", [
    ...prefix("formular", [
      route("download/pdf", "routes/shared/pdfDownloadLoader.ts", {
        id: "pdfPKH",
      }),
      route("*", "routes/shared/formular.ts", { id: "flowPKH" }),
    ]),
  ]),
  ...prefix("fluggastrechte", [
    ...prefix("vorabcheck", [
      index("services/flow/server/lastStep.ts", { id: "indexFGRV" }),
      route("*", "routes/shared/vorabcheck.ts", { id: "flowFGRV" }),
      route("visualisierung", "routes/shared/visualisierung.ts", {
        id: "visFGRV",
      }),
      route("ergebnis/*", "routes/shared/result.ts", { id: "resFGRV" }),
    ]),
    ...prefix("formular", [
      route("*", "routes/shared/formular.ts", { id: "flowFGRF" }),
      route("download/pdf", "routes/shared/pdfDownloadLoader.ts", {
        id: "pdfFGRF",
      }),
      route("visualisierung", "routes/shared/visualisierung.ts", {
        id: "visFGRF",
      }),
      route(
        "intro.redirect-vorabcheck-ergebnis",
        "routes/fluggastrechte.formular.intro.redirect-vorabcheck-ergebnis.tsx",
      ),
      route(
        "redirect-to-vorabcheck",
        "routes/fluggastrechte.formular.redirect-to-vorabcheck.tsx",
      ),
    ]),
  ]),
  ...prefix("kontopfaendung/wegweiser", [
    route("*", "routes/shared/vorabcheck.ts", { id: "flowKPV" }),
    route("wegweiser/ergebnis/*", "routes/shared/result.ts", {
      id: "resKPV",
    }),
  ]),
  ...prefix("geld-einklagen", [
    ...prefix("vorabcheck", [
      index("services/flow/server/lastStep.ts", { id: "indexGEV" }),
      route("*", "routes/shared/vorabcheck.ts", { id: "flowGEV" }),
      route("visualisierung", "routes/shared/visualisierung.ts", {
        id: "visGEV",
      }),
      route("ergebnis/*", "routes/shared/result.ts", { id: "resGEV" }),
      route(
        "geld-einklagen.vorabcheck.partnergericht.ergebnis",
        "routes/geld-einklagen.vorabcheck.partnergericht.ergebnis.$.tsx",
      ),
    ]),
    ...prefix("formular", [
      index("services/flow/server/lastStep.ts", { id: "indexGEF" }),
      route("*", "routes/shared/formular.ts", { id: "flowGEF" }),
      route("visualisierung", "routes/shared/visualisierung.ts", {
        id: "visGEF",
      }),
    ]),
  ]),
] satisfies RouteConfig;
