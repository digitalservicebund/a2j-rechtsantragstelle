import { Page, Text, View, Document } from "@react-pdf/renderer";
import {
  beratungshilfeFormular,
  type BeratungshilfeFormularContext,
} from "app/flows/beratungshilfe/beratungshilfeFormular";
import { abgabeContext } from "~/flows/shared/abgabe/context";
import { HandoutRow } from "../attachment/HandoutRow";
import { PdfFooter } from "../attachment/PdfFooter";
import { styles } from "../attachment/styles";

const { stringReplacements } = beratungshilfeFormular;
type ReplacementKey = keyof ReturnType<typeof stringReplacements>;

const documents = {
  hasBuergergeld: "Ihren aktuellen Bürgergeld-Bescheid",
  hasBuergergeldOrNoSozialleistung: "Kontoauszüge der letzten 3 Monate",
  staatlicheLeistungenIsGrundsicherung:
    "Ihren aktuellen Bescheid über Grundsicherung oder Sozialhilfe",
  arbeitslosenGeld: "Kopie Ihres aktuellen Arbeitslosengeld-Bescheids",
  staatlicheLeistungenIsAsylbewerberleistungen:
    "Ihren aktuellen Bescheid über Asylbewerberleistungen",
  wohngeld: "Kopie Ihres aktuellen Wohngeld-Bescheids",
  bafoeg:
    "Kopie Ihres aktuellen Bescheids über Bafoeg- oder Ausbildungsförderung",
  krankengeld:
    "Kopie Ihres Bescheids über Kranken- oder Pflegegeld (wenn vorhanden)",
  elterngeld: "Kopie Ihres aktuellen Elterngeld-Bescheids",
  hasLebensversicherung:
    "Kopie des letzten Jahreskontoauszugs für Ihre Lebensversicherung",
  hasBausparvertrag:
    "Kopie des letzten Jahreskontoauszugs für Ihren Bausparvertrag",
  hasWertpapiere:
    "Aktuellen Kontoauszug oder Bildschirmaufnahme von Ihrem Wertpapier-Depot",
  hasGutenhabenKrypto:
    "Aktuellen Kontoauszug oder Bildschirmaufnahme von Ihrem Paypal-, Krypto- oder anderem Guthaben-Konto",
  hasGiroTagesSparkonto:
    "Aktuellen Kontoauszug oder Bildschirmaufnahme von Ihrem Giro-, Tagesgeld- oder Sparkonto",
  hasGrundeigentum: "Kopie des Grundbuchauszugs von Ihrem Grundeigentum",
  hasSchwangerschaft: "Angabe des voraussichtlichen Entbindungstermins",
  hasSchwerbehinderung:
    "Kopie des Schwerbehindertensuasweis, oder Nachweis über die Behinderung",
  hasMedicalReasons:
    "Bescheinigung der medizinischen Notwendigkeit der kostenaufwändigen Ernährung",
  hasWeitereAusgaben:
    "Unterlagen, die Ihre Ausgaben belegen, wenn diese nicht auf den Kontoauszügen zu sehen sind",
} as const satisfies Partial<Record<ReplacementKey, string>>;

type Step = {
  title: string;
  value?: string | ((validAmtsgericht: boolean) => string);
};

export const dynamicSteps: { [key: string]: Step[] } = {
  [abgabeContext.abgabeArt.Enum.ausdrucken]: [
    { title: "Antrag ausdrucken" },
    {
      title: "Antrag unterschreiben",
      value:
        "Unterschreiben Sie den fertigen Antrag auf der letzten Seite im Feld “Unterschrift des Antragstellers/der Antragstellerin”",
    },
    {
      title: "Benötigte Dokumente kopieren",
      value: "Diese Dokumente müssen Sie zusammen mit Ihrem Antrag abgeben:",
    },
    {
      title: "Antrag abgeben",
      value: (validAmtsgericht) =>
        `Sie können den Antrag direkt im Amtsgericht abgeben oder per Post schicken. ${validAmtsgericht ? "Die Adresse des zuständigen Amtsgericht finden Sie auf der ersten Seite des Antrags im Adressfeld." : "Ihr zuständiges Amtsgericht finden Sie über den Service “Amtsgericht finden” auf https://service.justiz.de/beratungshilfe."}`,
    },
  ],
  [abgabeContext.abgabeArt.Enum.online]: [
    {
      title: "Antrag prüfen und speichern",
      value:
        "Sie müssen den Antrag nicht unterschreiben, da Sie sich später mit Ihrem BundID Konto anmelden.",
    },
    {
      title: "Benötigte Dokumente scannen",
      value: "Diese Dokumente müssen Sie zusammen mit Ihrem Antrag abgeben:",
    },
    {
      title: "Antrag über das Portal Mein Justizpostfach versenden",
      value:
        "Melden Sie sich mit Ihrem BundID Konto bei Mein Justizpostfach an. Dort können Sie alle Unterlagen hochladen und versenden. Mein Justizpostfach finden Sie hier: https://ebo.bund.de",
    },
  ],
};

const Handout = (userdata: BeratungshilfeFormularContext, footer: string) => {
  const conditions = stringReplacements(userdata);

  const relevantDocuments = [
    "Unterlagen zu Ihrem rechtlichen Problem",
    "Kopie Ihres aktuellen Mietvertrags",
    ...Object.keys(documents)
      .filter((key) => conditions[key as ReplacementKey])
      .map((key) => documents[key as keyof typeof documents]),
  ] as const;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          {
            <Text style={styles.pageHeader} fixed>
              Merkblatt: Antrag auf Bewilligung von Beratungshilfe von{" "}
              {userdata.vorname} {userdata.nachname}
            </Text>
          }
          <Text style={styles.h1}>Ihre nächsten Schritte</Text>
          <Text style={styles.h2}>
            {userdata.abgabeArt === "online"
              ? "So stellen Sie den Antrag online"
              : "So schicken Sie den Antrag ins Amtsgericht"}
          </Text>
          {dynamicSteps[userdata.abgabeArt ?? "ausdrucken"].map(
            (step, idx, stepArr) => {
              return (
                <View key={step.title}>
                  {/* Always print the required documents list second-to-last */}
                  {idx === stepArr.length - 1 && (
                    <View
                      style={{
                        border: "1px solid black",
                        marginHorizontal: "13px",
                        marginVertical: "5px",
                        paddingHorizontal: "16px",
                        paddingVertical: "8px",
                        gap: "8px",
                      }}
                    >
                      {relevantDocuments.map((doc) => (
                        <HandoutRow key={doc} text={doc} />
                      ))}
                    </View>
                  )}
                  <Text style={styles.h3}>
                    {idx + 1}. {step.title}
                  </Text>
                  {step.value && (
                    <Text style={styles.sectionIndented}>
                      {typeof step.value === "string"
                        ? step.value
                        : // Print the conditional Amtsgericht message
                          step.value(Boolean(conditions.courtName))}
                    </Text>
                  )}
                </View>
              );
            },
          )}
        </View>
        <PdfFooter footer={footer} />
      </Page>
    </Document>
  );
};

export default Handout;
