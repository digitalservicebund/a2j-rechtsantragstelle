import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "BundesSans",
  src: "./public/fonts/BundesSansWeb-Regular.woff",
  fontWeight: "normal",
});

Font.register({
  family: "BundesSansBold",
  src: "./public/fonts/BundesSansWeb-Bold.woff",
  fontWeight: "bold",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: "32px 48px",
    fontFamily: "BundesSans",
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
    fontFamily: "BundesSansBold",
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
