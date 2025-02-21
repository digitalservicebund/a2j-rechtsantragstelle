/* eslint-disable @typescript-eslint/no-explicit-any */
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { ValidationResult } from "remix-validated-form";
import { FlowId } from "~/domains/flowIds";
import { uploadUserFileToS3 } from "~/services/externalDataStorage/storeUserFileToS3Bucket";
import { getSessionManager, updateSession } from "~/services/session.server";
import {
  arrayIndexFromFormData,
  arrayFromSession,
  deleteFromArrayInplace,
} from "~/services/session.server/arrayDeletion";
import { validatorForFieldNames } from "~/services/validation/stepValidator/validatorForFieldNames";
import { validateFormData } from "~/services/validation/validateFormData.server";
import { filterFormData } from "~/util/filterFormData";

export async function parseMultipartFormData(
  request: Request,
  pathname: string,
  flowId: FlowId,
): Promise<{
  validationResult: ValidationResult<any> | undefined;
  response?: Response;
}> {
  const requestCopy = request.clone();
  const { getSession, commitSession } = getSessionManager(flowId);
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await getSession(cookieHeader);
  let validationResult: ValidationResult<any> | undefined;
  let response: Response | undefined;
  let formData = await unstable_parseMultipartFormData(
    request,
    async ({ filename, data, name, contentType }) => {
      if (!filename) {
        return;
      }
      // Must convert to File
      const dataArr = [];
      for await (const chunk of data) {
        dataArr.push(chunk);
      }
      const file = new File(dataArr, filename, { type: contentType });
      const submittedData = { [name]: file };
      validationResult = await validatorForFieldNames(
        [name],
        pathname,
      ).validate(submittedData);
      if (validationResult.error) {
        return;
      }
      const s3UploadResult = await uploadUserFileToS3(request, file);
      return Promise.resolve(
        JSON.stringify({
          etag: s3UploadResult?.ETag,
          createdOn: new Date(),
          filename,
          sizeKb: file.size / 1024,
        }),
      );
    },
  );

  // non-file upload case, parse formData normally
  if (!validationResult) {
    formData = await requestCopy.formData();
    const relevantFormData = filterFormData(formData);

    if (formData.get("_action") === "delete") {
      try {
        const { arrayName, index } = arrayIndexFromFormData(relevantFormData);
        const arrayToMutate = arrayFromSession(arrayName, flowSession);
        deleteFromArrayInplace(arrayToMutate, index);
        updateSession(flowSession, { [arrayName]: arrayToMutate });
        const headers = { "Set-Cookie": await commitSession(flowSession) };
        response = new Response("success", { status: 200, headers });
      } catch (err) {
        response = new Response((err as Error).message, { status: 422 });
      }
    }

    validationResult = await validateFormData(pathname, relevantFormData);
  } else if (!validationResult.error) {
    // file upload, need to de-serialize values
    for (const [key, val] of formData.entries()) {
      const parsedValue = JSON.parse(val as string);
      validationResult.data[key] = parsedValue;
    }
  }

  return { validationResult, response };
}
