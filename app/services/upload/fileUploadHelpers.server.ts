import { type ValidationErrorResponseData } from "@rvf/react-router";
import { type z } from "zod";
import { type FlowId } from "~/domains/flowIds";
import { getPageSchema } from "~/domains/pageSchemas";
import { type ArrayData, type UserData, getContext } from "~/domains/userData";
import {
  uploadUserFileToS3,
  deleteUserFileFromS3,
} from "~/services/externalDataStorage/userFileS3Helpers";
import { splitFieldName } from "./splitFieldName";
import { getSessionIdByFlowId, type CookieHeader } from "../session.server";
import { FILE_REQUIRED_ERROR } from "./constants";

export async function uploadUserFile(
  inputName: string,
  cookieHeader: CookieHeader,
  formData: FormData,
  userData: UserData,
  flowId: FlowId,
  pathname: string,
): Promise<{ userData: UserData } | ValidationErrorResponseData> {
  const { fieldName, inputIndex } = splitFieldName(inputName);
  const arrayUserData = [...((userData[fieldName] ?? []) as ArrayData)];
  const fieldSchema =
    getPageSchema(pathname)?.[fieldName] ??
    (getContext(flowId)[fieldName as keyof typeof getContext] as
      | z.ZodType
      | undefined);
  if (!fieldSchema) return { fieldErrors: {} };
  const file = formData.get(inputName) as File | undefined;

  if (!file) {
    return { fieldErrors: { [inputName]: FILE_REQUIRED_ERROR } };
  }

  arrayUserData[inputIndex] = {
    filename: file.name,
    fileType: file.type,
    fileSize: file.size,
  };
  const validatedArray = fieldSchema.safeParse(arrayUserData);

  if (!validatedArray.success)
    return {
      fieldErrors: { [inputName]: validatedArray.error.issues[0].message },
      repopulateFields: { [fieldName]: arrayUserData },
    };

  const sessionId = await getSessionIdByFlowId(flowId, cookieHeader);
  const savedFileKey = await uploadUserFileToS3(
    sessionId,
    flowId,
    await file.arrayBuffer(),
  );
  arrayUserData[inputIndex].savedFileKey = savedFileKey;

  return { userData: { [fieldName]: arrayUserData } };
}

export async function deleteUserFile(
  inputName: string,
  cookieHeader: CookieHeader,
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
