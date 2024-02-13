import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: "48px 72px",
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
    fontWeight: "bold",
    paddingBottom: "2px",
  },
  text: {
    fontSize: 12,
    lineHeight: 1.4,
  },
});

type DescriptionsProps = {
  readonly descriptions: {
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
