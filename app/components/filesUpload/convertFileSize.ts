export function convertFileSize(fileSize: number) {
  const oneMegaByteInBytes = 1024 * 1024;
  const fileBytesToMegabytes = `${((fileSize ?? 0) / oneMegaByteInBytes).toLocaleString("de-DE", { maximumFractionDigits: 1 })} MB`;
  return fileBytesToMegabytes;
}
