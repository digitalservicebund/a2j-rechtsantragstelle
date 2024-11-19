import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

const fontMap = {
  regular: FONTS_BUNDESSANS_REGULAR,
  bold: FONTS_BUNDESSANS_BOLD,
};

export const pdfStyles = {
  page: {
    fontSize: 10,
    font: fontMap.regular,
  },
  pageHeader: {
    fontSize: 8,
    paddingBottom: 8,
    font: fontMap.regular,
  },
  h1: {
    fontSize: 31,
    font: fontMap.bold,
  },
  h2: {
    fontSize: 16,
    font: fontMap.bold,
  },
  h3: {
    fontSize: 14,
    font: fontMap.bold,
  },
  h4: {
    fontSize: 12,
    font: fontMap.bold,
  },
  h5: {
    fontSize: 10,
    font: fontMap.bold,
  },
  sectionIndented: {
    paddingLeft: 13,
  },
  bold: {
    font: fontMap.bold,
  },
  list: {
    paddingLeft: 23,
  },
};
