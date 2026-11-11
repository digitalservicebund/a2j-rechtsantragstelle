import {
  Anspruchsart,
  createFortlaufendeNummerGenerator,
  createRollennummerGenerator,
  createUuidGenerator,
  datatypeC,
  datatypeE,
  ergonomics,
  reference,
  Rollenbezeichnung,
  verifyZahlungsklage,
  zahlungsklage,
  type AnspruchFuerZahlungsklage,
  type ScopeToken,
} from "@digitalservicebund/a2j-xjustiz-bridge/nachricht/zahlungsklage";
import z from "zod";
import { Result } from "true-myth";
import { type XjustizError } from "~/domains/flows.server";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import {
  anwaltskostenAntragText,
  hauptforderungAntragText,
  zinsenAntragText,
} from "~/domains/geldEinklagen/services/antragTexts";
import { getResponsibleCourt } from "~/domains/geldEinklagen/services/court/getResponsibleCourt";
import { parseCurrencyStringDE } from "~/services/validation/money/formatCents";
import { findGerichtByXjustizId } from "./findGerichtByXjustizId";
import {
  beteiligteFromUserData,
  beteiligteSchema,
  composeZeugen,
  toBeklagter,
  toKlaeger,
} from "./beteiligte";

type CompositionInput = {
  readonly userData: GeldEinklagenFormularUserData;
  readonly baseUrl: string;
};

const invalidUserData = (issues: unknown) =>
  Result.err<string, XjustizError>({ reason: "invalidUserData", issues });

export async function geldEinklagenXjustizFromUserdata({
  userData,
  baseUrl,
}: CompositionInput): Promise<Result<string, XjustizError>> {
  const gericht = findGerichtByXjustizId(
    getResponsibleCourt(userData)?.XJUSTIZID,
  );
  if (gericht === undefined)
    return Result.err({ reason: "noResponsibleCourt" });

  const beteiligte = beteiligteSchema.safeParse(
    beteiligteFromUserData(userData),
  );
  if (!beteiligte.success)
    return invalidUserData(z.treeifyError(beteiligte.error));

  const forderungInEuro = parseCurrencyStringDE(userData.forderungGesamtbetrag);
  const { prozesszinsen, anwaltskosten } = userData;

  const sachantragText = datatypeE(
    hauptforderungAntragText(
      userData.forderungGesamtbetrag ?? "",
      prozesszinsen,
    ),
  );
  if (sachantragText.issues) return invalidUserData(sachantragText.issues);

  const zinsenText =
    prozesszinsen === "yes" ? datatypeE(zinsenAntragText) : undefined;
  if (zinsenText?.issues) return invalidUserData(zinsenText.issues);

  const anwaltskostenText = anwaltskosten
    ? datatypeE(anwaltskostenAntragText(anwaltskosten, prozesszinsen))
    : undefined;
  if (anwaltskostenText?.issues)
    return invalidUserData(anwaltskostenText.issues);

  const weitereAntraegeText = userData.weitereAntraege
    ? datatypeE(userData.weitereAntraege)
    : undefined;
  if (weitereAntraegeText?.issues)
    return invalidUserData(weitereAntraegeText.issues);

  const begruendungText = datatypeC(
    (userData.abschnitte ?? []).map((a) => a.beschreibung).join("\n\n"),
  );
  if (begruendungText.issues) return invalidUserData(begruendungText.issues);

  const rechtlicheWuerdigungText = userData.rechtlicheWuerdigung
    ? datatypeC(userData.rechtlicheWuerdigung)
    : undefined;
  if (rechtlicheWuerdigungText?.issues)
    return invalidUserData(rechtlicheWuerdigungText.issues);

  const result = await zahlungsklage(
    <NachrichtenScope>(scope: ScopeToken<NachrichtenScope>) => {
      const uuid = createUuidGenerator(scope);
      const rollennummer = createRollennummerGenerator(scope);
      const fortlaufendeNummer = createFortlaufendeNummerGenerator(scope);

      const eigeneNachrichtenID = uuid.first();
      const vortragsID = uuid.next(eigeneNachrichtenID);

      const rollennummerKlaeger = rollennummer.first(
        Rollenbezeichnung["Kläger(in)"],
      );
      const rollennummerBeklagter = rollennummer.next(
        rollennummerKlaeger,
        Rollenbezeichnung["Beklagte(r)"],
      );

      const klaeger = toKlaeger(rollennummerKlaeger, beteiligte.data.klaeger);
      const beklagter = toBeklagter(
        rollennummerBeklagter,
        beteiligte.data.beklagter,
      );

      const zeugen = composeZeugen(
        scope,
        rollennummerBeklagter,
        beteiligte.data.zeugen,
      );

      const nummerSachanspruch = fortlaufendeNummer.first("Anspruch");
      const sachanspruch = {
        fortlaufendeNummer: nummerSachanspruch,
        anspruchssteller: [{ refRollennummer: reference(rollennummerKlaeger) }],
        anspruchsgegner: [
          { refRollennummer: reference(rollennummerBeklagter) },
        ],
        anspruchsart: Anspruchsart.Zahlung,
        wertAnspruch: ergonomics.geldbetrag(forderungInEuro),
      } satisfies AnspruchFuerZahlungsklage<NachrichtenScope>;

      const sonstigeAntraege = [
        ...(anwaltskostenText
          ? [
              ergonomics.antragAufAnwaltskosten(
                scope,
                fortlaufendeNummer.next(nummerSachanspruch, "Anspruch"),
                rollennummerKlaeger,
                rollennummerBeklagter,
                ergonomics.geldbetrag(parseCurrencyStringDE(anwaltskosten)),
                anwaltskostenText.value,
              ),
            ]
          : []),
        ...(userData.versaeumnisurteil === "yes"
          ? [ergonomics.antragAufVersaeumnisurteil()]
          : []),
        ...(weitereAntraegeText
          ? [ergonomics.weitererAntrag(weitereAntraegeText.value)]
          : []),
      ];

      return verifyZahlungsklage(scope, {
        nachrichtenkopf: ergonomics.nachrichtenkopf(
          scope,
          eigeneNachrichtenID,
          klaeger,
          gericht,
        ),
        grunddaten: {
          verfahrensdaten: {
            beteiligung: [klaeger, beklagter, ...zeugen.beteiligungen],
          },
        },
        inhaltsdaten: {
          antraege: {
            sachantraege: {
              inhalt: sachantragText.value,
              anspruch: [sachanspruch],
            },
            nebenantraegeZinsen: zinsenText
              ? { inhalt: zinsenText.value }
              : undefined,
            auswahlSonstigeAntraege:
              sonstigeAntraege.length > 0 ? sonstigeAntraege : undefined,
          },
          beweis: zeugen.beweise.length > 0 ? zeugen.beweise : undefined,
          auswahlBegruendetheit: {
            anderesKlageverfahren: {
              vortrag: [
                {
                  schlagwort: datatypeC("Begruendung").value,
                  vortragsID,
                  ausfuehrungen: {
                    inhalt: {
                      tatsachenvortragSachverhaltsbeschreibung:
                        begruendungText.value,
                      rechtlicheWuerdigung: rechtlicheWuerdigungText?.value,
                    },
                    refBeweisNummer: zeugen.beweise.map((beweis) =>
                      reference(beweis.beweisNummer),
                    ),
                  },
                },
              ],
            },
          },
        },
      });
    },
    { baseUrl },
  );

  return result.ok
    ? Result.ok(result.xjustizMessageXml)
    : Result.err({ reason: "xjustizToolsFailed" });
}
