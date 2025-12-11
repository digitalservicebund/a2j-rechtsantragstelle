import { parseFormData } from "@rvf/react";
import { validationError } from "@rvf/react-router";
import { type ActionFunctionArgs, redirect } from "react-router";
import z from "zod";
import { getSessionManager } from "~/services/session.server";

export const loader = () => redirect("/");

const actionHighlightText = z.object({
  arrayCategory: z.string(),
  field: z.string(),
  arrayIndex: z.coerce.number(),
  startOffset: z.coerce.number(),
  endOffset: z.coerce.number(),
});

type HighlightData = {
  highlightTexts: [{ startOffset: number; endOffset: number }];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const {
    error,
    submittedData,
    data: highlightTextData,
  } = await parseFormData(formData, actionHighlightText);

  if (error) {
    return validationError(error, submittedData);
  }

  const { getSession, commitSession } = getSessionManager("highlight-texts");

  const session = await getSession(request.headers.get("Cookie"));

  const highlightKey = `${highlightTextData.arrayCategory}_${highlightTextData.arrayIndex}`;

  const userHighlightData = (session.get(highlightKey) as Record<
    string,
    HighlightData
  >) ?? {
    [highlightTextData.field]: { highlightTexts: [] },
  };

  userHighlightData[highlightTextData.field].highlightTexts.push({
    startOffset: highlightTextData.startOffset,
    endOffset: highlightTextData.endOffset,
  });

  session.set(highlightKey, userHighlightData);
  const headers = { "Set-Cookie": await commitSession(session) };

  return new Response("success", { status: 200, headers });
};
