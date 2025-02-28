import { unstable_parseMultipartFormData } from "@remix-run/node";

export async function getFileFromFormData(request: Request, fieldName: string) {
  let file: File | undefined;
  await unstable_parseMultipartFormData(
    request,
    async ({ filename, data, name, contentType }) => {
      if (name !== fieldName || !filename) {
        return "";
      }
      file = await convertAsyncBufferToFile(data, filename, contentType);
      return undefined;
    },
  );
  return file;
}

async function convertAsyncBufferToFile(
  data: AsyncIterable<Uint8Array<ArrayBufferLike>>,
  filename: string,
  contentType: string,
): Promise<File> {
  const dataArr = [];
  for await (const chunk of data) {
    dataArr.push(chunk);
  }
  return new File(dataArr, filename, { type: contentType });
}

export function convertFileToMetadata(file?: File) {
  return {
    filename: file?.name,
    fileType: file?.type,
    fileSize: file?.size,
    createdOn: file?.lastModified ? new Date(file.lastModified).toString() : "",
  };
}
