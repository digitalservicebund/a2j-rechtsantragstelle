import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import type { Attachment } from ".";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: "48px 72px",
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
  },
  pageHeader: {
    fontSize: 8,
    paddingBottom: 8,
  },
  h1: {
    fontSize: 31,
    fontWeight: "bold",
    paddingTop: 8,
    paddingBottom: 16,
  },
  h2: {
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 16,
    paddingBottom: 8,
  },
  h3: {
    fontSize: 14,
    fontWeight: "bold",
    paddingTop: 8,
    paddingBottom: 8,
  },
  h4: {
    fontSize: 12,
    fontWeight: "bold",
    paddingTop: 8,
    paddingBottom: 8,
  },
  section: {
    flexGrow: 1,
    paddingHorizontal: 0,
    paddingBottom: 8,
    paddingTop: 0,
  },
  bold: {
    fontWeight: "bold",
  },
});

type DescriptionsProps = {
  readonly descriptions: Attachment;
};

const FormAttachment = ({ descriptions }: DescriptionsProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.pageHeader} fixed>
            <Text style={styles.bold}>Anhang:</Text> Antrag auf Bewilligung von
            Beratungshilfe
          </Text>
          <Text style={styles.h1}>Anhang</Text>
          {descriptions.map((description) => (
            <View key={description.title} style={styles.section}>
              <Text style={styles.h4}>{description.title}</Text>
              <Text>{description.text}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default FormAttachment;
