const bytesPerMegabyte = 1024 * 1024;
export function bytesToMegabytesString(bytesCount: number) {
  return `${((bytesCount ?? 0) / bytesPerMegabyte).toLocaleString("de-DE", { maximumFractionDigits: 1 })} MB`;
}
