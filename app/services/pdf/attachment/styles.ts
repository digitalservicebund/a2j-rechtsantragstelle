import { StyleSheet, Font } from "@react-pdf/renderer";

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

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: "48px 72px 66px 72px",
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
    paddingBottom: 4,
  },
  h4: {
    fontSize: 12,
    fontWeight: "bold",
    paddingTop: 8,
    paddingBottom: 0,
  },
  h5: {
    fontSize: 10,
    fontWeight: "bold",
    paddingTop: 2,
    paddingBottom: 0,
  },
  section: {
    paddingBottom: 2,
  },
  sectionIndented: {
    paddingBottom: 2,
    paddingLeft: 13,
  },
  bold: {
    fontWeight: "bold",
  },
  list: {
    gap: 8,
    paddingLeft: 23,
  },
});
