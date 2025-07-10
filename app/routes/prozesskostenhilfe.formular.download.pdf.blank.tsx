import { createPdfResponseHeaders } from "~/services/pdf/createPdfResponseHeaders";
import { readRelativeFileToBuffer } from "~/services/pdf/readRelativeFileToBuffer";

const pdfFilename = "250701_BMJ_Antrag_Prozesskostenhilfe_QRCode_bf";

export async function loader() {
  const pdf = await readRelativeFileToBuffer(
    `/data/pdf/prozesskostenhilfe/${pdfFilename}.pdf`,
  );
  return new Response(pdf, {
    headers: createPdfResponseHeaders(pdfFilename, pdf.byteLength),
  });
}
