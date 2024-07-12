import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { AttachmentEntries } from ".";

Font.register({
  family: "BundesSans",
  fonts: [
    {
      src: "public/fonts/BundesSansWeb-Bold.woff",
      fontWeight: "bold",
      fontStyle: "normal",
    },
    {
      src: "public/fonts/BundesSansWeb-Regular.woff",
      fontWeight: "normal",
      fontStyle: "normal",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: "48px 72px",
    fontFamily: "BundesSans",
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

export type AttachmentProps = Readonly<{
  entries: AttachmentEntries;
  header?: string;
}>;

const FormAttachment = ({ entries, header }: AttachmentProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          {header && (
            <Text style={styles.pageHeader} fixed>
              {header}
            </Text>
          )}
          <Text style={styles.h1}>Anhang</Text>
          {entries.map((entry) => (
            <View key={entry.title} style={styles.section}>
              <Text style={styles[entry.level ?? "h4"]}>{entry.title}</Text>
              <Text>{entry.text}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default FormAttachment;
