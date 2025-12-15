import { parseFormData } from "@rvf/react";
import { validationError } from "@rvf/react-router";
import { type ActionFunctionArgs, redirect } from "react-router";
import z from "zod";
import { getSessionManager } from "~/services/session.server";

export const loader = () => redirect("/");

const actionHighlightText = z.object({
  action: z.enum(["save", "delete"]),
  arrayCategory: z.string(),
  field: z.string(),
  arrayIndex: z.coerce.number(),
  startOffset: z.coerce.number(),
  endOffset: z.coerce.number(),
});

export type HighlightData = {
  highlightTexts: Array<{ startOffset: number; endOffset: number }>;
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

  // Store all highlights in a single session key with nested structure
  const allHighlights: Record<
    string,
    Record<number, Record<string, HighlightData>>
  > = session.get("highlights") ?? {};

  const { arrayCategory, arrayIndex, field, action, startOffset, endOffset } =
    highlightTextData;

  // Initialize nested structure if needed
  if (!allHighlights[arrayCategory]) {
    allHighlights[arrayCategory] = {};
  }
  if (!allHighlights[arrayCategory][arrayIndex]) {
    allHighlights[arrayCategory][arrayIndex] = {};
  }
  if (!allHighlights[arrayCategory][arrayIndex][field]) {
    allHighlights[arrayCategory][arrayIndex][field] = {
      highlightTexts: [],
    };
  }

  // Perform action
  if (action === "save") {
    allHighlights[arrayCategory][arrayIndex][field].highlightTexts.push({
      startOffset,
      endOffset,
    });
  } else if (action === "delete") {
    allHighlights[arrayCategory][arrayIndex][field].highlightTexts =
      allHighlights[arrayCategory][arrayIndex][field].highlightTexts.filter(
        (highlightText) =>
          highlightText.startOffset !== startOffset ||
          highlightText.endOffset !== endOffset,
      );
  }

  // Store back to session
  session.set("highlights", allHighlights);

  const headers = { "Set-Cookie": await commitSession(session) };

  return new Response("success", { status: 200, headers });
};
