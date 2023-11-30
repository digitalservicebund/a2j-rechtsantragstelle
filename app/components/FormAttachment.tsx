import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: "32px 48px",
  },
  pageHeader: {
    paddingBottom: 20,
    fontSize: 25,
    textAlign: "center",
  },
  section: {
    padding: 5,
    flexGrow: 1,
  },
  title: {
    fontSize: 15,
  },
  text: {
    fontSize: 12,
  },
});

type DescriptionsProps = {
  descriptions: {
    title: string;
    text: string;
  }[];
};

const FormAttachment = ({ descriptions }: DescriptionsProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.pageHeader}>
            Anhang zum Antrag auf Beratungshilfe
          </Text>
          {descriptions.map((description, index) => (
            <View key={index} style={styles.section}>
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
