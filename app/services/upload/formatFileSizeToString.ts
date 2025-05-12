const bytesPerMegabyte = 1024 * 1024;
const bytesPerKilobyte = 1024;

export function formatFileSizeToString(bytes: number) {
  if (bytes < bytesPerKilobyte) {
    return `${bytes} B`;
  }
  if (bytes < bytesPerMegabyte) {
    const kilobytes = bytes / bytesPerKilobyte;
    return `${kilobytes.toLocaleString("de-DE", { maximumFractionDigits: 1 })} KB`;
  }
  const megabytes = bytes / bytesPerMegabyte;
  return `${megabytes.toLocaleString("de-DE", { maximumFractionDigits: 1 })} MB`;
}
