import { Text } from "@react-pdf/renderer";

export function PdfFooter({ footer }: { readonly footer: string }) {
  return (
    <Text
      style={{
        position: "absolute",
        bottom: 56,
        right: 72,
      }}
      render={({ pageNumber, totalPages }) =>
        `${footer} | ${pageNumber} / ${totalPages}`
      }
      fixed
    />
  );
}
