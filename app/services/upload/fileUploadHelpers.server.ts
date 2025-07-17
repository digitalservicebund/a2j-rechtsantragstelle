import { parseFormData } from "@mjackson/form-data-parser";
import { type ValidationErrorResponseData } from "@rvf/react-router";
import { type z } from "zod";
import { type FlowId } from "~/domains/flowIds";
import { type ArrayData, type UserData, getContext } from "~/domains/userData";
import {
  uploadUserFileToS3,
  deleteUserFileFromS3,
} from "~/services/externalDataStorage/userFileS3Helpers";
import { FIFTEEN_MB_IN_BYTES } from "~/services/validation/pdfFileSchema";
import { splitFieldName } from "./splitFieldName";
import { getSessionIdByFlowId } from "../session.server";
import { FILE_REQUIRED_ERROR } from "./constants";
import { resolveArraysFromKeys } from "../array/resolveArraysFromKeys";

export async function uploadUserFile(
  inputName: string,
  request: Request,
  flowId: FlowId,
): Promise<{ userData: UserData } | ValidationErrorResponseData> {
  const { fieldName, inputIndex } = splitFieldName(inputName);
  const fieldSchema = getContext(flowId)[
    fieldName as keyof typeof getContext
  ] as z.ZodTypeAny | undefined;
  if (!fieldSchema) return { fieldErrors: {} };

  const formData = await parseFormData(request, {
    maxFileSize: FIFTEEN_MB_IN_BYTES,
  });
  const file = formData.get(inputName) as File | undefined;

  if (!file) {
    return { fieldErrors: { [inputName]: FILE_REQUIRED_ERROR } };
  }

  const newArray = new Array(inputIndex + 1);
  newArray[inputIndex] = {
    filename: file.name,
    fileType: file.type,
    fileSize: file.size,
  };
  const validatedArray = fieldSchema.safeParse(newArray);
  if (!validatedArray.success)
    return {
      fieldErrors: { [inputName]: validatedArray.error.issues[0].message },
      repopulateFields: { [fieldName]: newArray },
    };

  const sessionId = await getSessionIdByFlowId(
    flowId,
    request.headers.get("Cookie"),
  );
  const savedFileKey = await uploadUserFileToS3(
    sessionId,
    flowId,
    await file.arrayBuffer(),
  );

  newArray[inputIndex].savedFileKey = savedFileKey;
  return { userData: resolveArraysFromKeys({ [fieldName]: newArray }) };
}

export async function deleteUserFile(
  inputName: string,
  cookieHeader: string | null,
  userData: UserData,
  flowId: FlowId,
) {
  const { fieldName, inputIndex } = splitFieldName(inputName);
  const arrayUserData = userData[fieldName] as ArrayData | undefined;
  if (!arrayUserData) return undefined;
  const savedFile = arrayUserData.at(inputIndex);
  if (typeof savedFile?.savedFileKey !== "string") return undefined;
  const sessionId = await getSessionIdByFlowId(flowId, cookieHeader);
  await deleteUserFileFromS3(sessionId, flowId, savedFile.savedFileKey);
  return {
    [fieldName]: arrayUserData.filter((_, index) => index !== inputIndex),
  };
}
