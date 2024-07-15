import { Page, Text, View, Document } from "@react-pdf/renderer";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { PdfFooter } from "../attachment/PdfFooter";
import { styles } from "../attachment/styles";

const Handout = (userdata: BeratungshilfeFormularContext, footer: string) => {
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
          <Text style={styles.section}>
            Unterschreiben Sie den fertigen Antrag auf der letzten Seite im Feld
            “Unterschrift des Antragstellers/der Antragstellerin”
          </Text>
          <Text style={styles.h3}>3. Benötigte Dokumente kopieren</Text>
          <Text style={styles.section}>
            Diese Dokumente müssen Sie zusammen mit Ihrem Antrag abgeben:
          </Text>
          <Text style={styles.h3}>4. Antrag abgeben</Text>
          <Text style={styles.section}>
            Sie können den Antrag direkt im Amtsgericht abgeben oder per Post
            schicken. Die Adresse des zuständigen Amtsgericht finden Sie auf der
            ersten Seite des Antrags im Adressfeld. / Ihr zuständiges
            Amtsgericht finden Sie über den Service “Amtsgericht finden” auf
            https://service.justiz.de/beratungshilfe.
          </Text>
        </View>
        <PdfFooter footer={footer} />
      </Page>
    </Document>
  );
};

export default Handout;
