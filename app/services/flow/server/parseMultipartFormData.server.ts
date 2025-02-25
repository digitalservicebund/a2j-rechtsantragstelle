/* eslint-disable @typescript-eslint/no-explicit-any */
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { ValidationResult } from "remix-validated-form";
import { FlowId } from "~/domains/flowIds";
import { uploadUserFiles } from "~/services/externalDataStorage/storeUserFileToS3Bucket";
import { getSessionManager, updateSession } from "~/services/session.server";
import {
  arrayIndexFromFormData,
  arrayFromSession,
  deleteFromArrayInplace,
} from "~/services/session.server/arrayDeletion";
import { validateFormData } from "~/services/validation/validateFormData.server";
import { filterFormData } from "~/util/filterFormData";

export async function parseAndValidateFormData(
  request: Request,
  pathname: string,
): Promise<ValidationResult<any>> {
  const formFieldsMap = await parseMultipartFormData(request);

  const validationResult = await validateFormData(pathname, formFieldsMap);
  if (validationResult.error) {
    return validationResult;
  }
  const fileUploads = Object.entries(formFieldsMap).filter(
    ([_, value]) => "name" in (value as File),
  );

  if (fileUploads.length > 0) {
    (
      await uploadUserFiles(
        fileUploads.map(([fieldName, value]) => [fieldName, value as File]),
        request,
      )
    ).forEach(({ fieldName, ...fileMetadata }) => {
      validationResult.data[fieldName] = fileMetadata;
    });
  }

  return validationResult;
}

async function parseMultipartFormData(request: Request) {
  const formFieldsMap: Record<string, string | File> = {};
  await unstable_parseMultipartFormData(
    request,
    async ({ filename, data, name, contentType }) => {
      let value: string | File | undefined;
      if (name.startsWith("_")) {
        // filter out metadata
        return;
      } else if (!filename) {
        // non-file input (normal input)
        for await (const part of data) {
          value = new TextDecoder().decode(part);
        }
      } else {
        value = await convertAsyncBufferToFile(data, filename, contentType);
      }
      formFieldsMap[name] = value ?? "";
      return undefined;
    },
  );
  return formFieldsMap;
}

export async function deleteArrayItem(
  flowId: FlowId,
  formData: FormData,
  request: Request,
): Promise<Response> {
  const { getSession, commitSession } = getSessionManager(flowId);
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await getSession(cookieHeader);
  const relevantFormData = filterFormData(formData);
  try {
    const { arrayName, index } = arrayIndexFromFormData(relevantFormData);
    const arrayToMutate = arrayFromSession(arrayName, flowSession);
    deleteFromArrayInplace(arrayToMutate, index);
    updateSession(flowSession, { [arrayName]: arrayToMutate });
    const headers = { "Set-Cookie": await commitSession(flowSession) };
    return new Response("success", { status: 200, headers });
  } catch (err) {
    return new Response((err as Error).message, { status: 422 });
  }
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
