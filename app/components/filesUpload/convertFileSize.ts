export function convertFileSize(fileSizes: number[]) {
  const oneMegaByteInBytes = 1024 * 1024;
  const totalFileSize = (fileSizes ?? []).reduce((acc, size) => acc + size, 0);
  const fileBytesToMegabytes = `${(totalFileSize / oneMegaByteInBytes).toLocaleString("de-DE", { maximumFractionDigits: 1 })} MB`;
  return fileBytesToMegabytes;
}
