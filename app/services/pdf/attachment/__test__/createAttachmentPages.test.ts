import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import * as createAttachmentEntriesModule from "~/services/pdf/attachment/createAttachmentEntries";
import * as createHeadingModule from "~/services/pdf/createHeading";
import * as createHeaderModule from "~/services/pdf/header/createHeader";
import type { AttachmentEntries } from "..";
import { createAttachmentPages } from "../createAttachmentPages";

describe("createAttachmentPages", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should create attachment page", () => {
    const createHeaderSpy = vi.spyOn(createHeaderModule, "createHeader");
    const createHeadingSpy = vi.spyOn(createHeadingModule, "createHeading");
    const createAttachmentEntriesSpy = vi.spyOn(
      createAttachmentEntriesModule,
      "createAttachmentEntries",
    );

    const userData: ProzesskostenhilfeFormularContext = {
      vorname: "Alfred J.",
      nachname: "Kwack",
    };
    const attachment: AttachmentEntries = [{ title: "Test Title" }];
    const headerText = "Test Header";

    const documentStruct = mockPdfKitDocumentStructure();
    const doc = mockPdfKitDocument(documentStruct);
    const attachmentPagesStruct = doc.struct("Sect");

    createAttachmentPages({
      doc,
      documentStruct,
      userData,
      attachment,
      headerText,
    });

    expect(createHeaderSpy).toBeCalledTimes(1);
    expect(createHeaderSpy).toBeCalledWith(
      doc,
      documentStruct,
      userData,
      headerText,
    );
    expect(createHeadingSpy).toBeCalledTimes(1);
    expect(createHeadingSpy).toBeCalledWith(
      doc,
      attachmentPagesStruct,
      "Anhang",
      "H1",
    );
    expect(createAttachmentEntriesSpy).toBeCalledTimes(1);
    expect(createAttachmentEntriesSpy).toBeCalledWith(
      doc,
      attachmentPagesStruct,
      attachment,
    );
  });
});
