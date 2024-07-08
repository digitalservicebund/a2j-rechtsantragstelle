import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import type { Attachment } from ".";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: "48px 72px",
    fontFamily: "Helvetica",
  },
  pageHeader: {
    paddingBottom: 20,
    fontSize: 16,
    textAlign: "left",
  },
  section: {
    padding: "5px 0",
    flexGrow: 1,
  },
  title: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    paddingBottom: "2px",
  },
  text: {
    fontSize: 12,
    lineHeight: 1.4,
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
          <Text style={styles.pageHeader}>
            Anhang zum Antrag auf Beratungshilfe
          </Text>
          {descriptions.map((description) => (
            <View key={description.title} style={styles.section}>
              <Text style={styles.title}>{description.title}</Text>
              <Text style={styles.text}>{description.text}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default FormAttachment;
