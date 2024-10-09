export function createPdfResponseHeaders(
  filename: string,
  fileContentLength: number,
) {
  // The default character set for HTTP headers is ISO-8859-1.
  // There is however RFC 6266, describing how you can encode the file name
  // in a Content-Disposition header:
  // https://datatracker.ietf.org/doc/html/rfc6266#section-5
  return {
    "Content-Type": "application/pdf",
    "Content-Disposition": `inline; filename=${encodeURIComponent(filename)}`,
    "Content-Length": fileContentLength.toString(),
  };
}
