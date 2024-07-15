import { Page, Text, View, Document } from "@react-pdf/renderer";
import type { AttachmentEntries } from ".";
import { styles } from "./styles";

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
            <View key={entry.title} style={styles.section} wrap={false}>
              <Text style={styles[entry.level ?? "h5"]}>{entry.title}</Text>
              <Text>{entry.text}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default FormAttachment;
