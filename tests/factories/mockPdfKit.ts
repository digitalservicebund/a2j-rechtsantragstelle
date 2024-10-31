export const mockPdfKitDocumentStructure = () => {
  return {
    add: vi.fn(),
  } as unknown as PDFKit.PDFStructureElement;
};

export const mockPdfKitDocument = (
  mockStructure: PDFKit.PDFStructureElement,
  range?: {
    start: number;
    count: number;
  },
) => {
  return {
    text: vi.fn().mockReturnThis(),
    fontSize: vi.fn().mockReturnThis(),
    font: vi.fn().mockReturnThis(),
    moveDown: vi.fn().mockReturnThis(),
    list: vi.fn().mockReturnThis(),
    save: vi.fn().mockReturnThis(),
    rotate: vi.fn().mockReturnThis(),
    rect: vi.fn().mockReturnThis(),
    stroke: vi.fn().mockReturnThis(),
    restore: vi.fn().mockReturnThis(),
    switchToPage: vi.fn().mockReturnThis(),
    bufferedPageRange: vi.fn((_type, _options, contentFn) => {
      if (contentFn) contentFn();
      return range;
    }),
    struct: vi.fn((_type, _options, contentFn) => {
      if (contentFn) contentFn();
      return mockStructure;
    }),
    addPage: vi.fn().mockReturnThis(),
  } as unknown as PDFKit.PDFDocument;
};
