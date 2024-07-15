import { Page, Text, View, Document } from "@react-pdf/renderer";
import {
  beratungshilfeFormular,
  type BeratungshilfeFormularContext,
} from "~/flows/beratungshilfeFormular";
import { HandoutRow } from "../attachment/HandoutRow";
import { PdfFooter } from "../attachment/PdfFooter";
import { styles } from "../attachment/styles";

const { stringReplacements } = beratungshilfeFormular;
type ReplacementKey = keyof ReturnType<typeof stringReplacements>;

const documents = {
  hasBuergergeld: "Ihren aktuellen Bürgergeld-Bescheid",
  hasBuergergeldOrNoSozialleistung: "Kontoauszüge der letzten 3 Monate",
  hasGrundsicherung:
    "Ihren aktuellen Bescheid über Grundsicherung oder Sozialhilfe",
  arbeitslosenGeld: "Kopie Ihres aktuellen Arbeitslosengeld-Bescheids",
  hasAsylbewerberleistungen:
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
            So schicken Sie den Antrag ins Amtsgericht
          </Text>
          <Text style={styles.h3}>1. Antrag ausdrucken</Text>
          <Text style={styles.h3}>2. Antrag unterschreiben</Text>
          <Text style={styles.sectionIndented}>
            Unterschreiben Sie den fertigen Antrag auf der letzten Seite im Feld
            “Unterschrift des Antragstellers/der Antragstellerin”
          </Text>
          <Text style={styles.h3}>3. Benötigte Dokumente kopieren</Text>
          <Text style={styles.sectionIndented}>
            Diese Dokumente müssen Sie zusammen mit Ihrem Antrag abgeben:
          </Text>
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
          <Text style={styles.h3}>4. Antrag abgeben</Text>
          <Text style={styles.sectionIndented}>
            Sie können den Antrag direkt im Amtsgericht abgeben oder per Post
            schicken.{" "}
            {conditions.courtName
              ? "Die Adresse des zuständigen Amtsgericht finden Sie auf der ersten Seite des Antrags im Adressfeld."
              : "Ihr zuständiges Amtsgericht finden Sie über den Service 'Amtsgericht finden' auf https://service.justiz.de/beratungshilfe."}
          </Text>
        </View>
        <PdfFooter footer={footer} />
      </Page>
    </Document>
  );
};

export default Handout;
