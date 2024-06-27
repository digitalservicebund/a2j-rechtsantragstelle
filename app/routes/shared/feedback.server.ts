import { ActionFunctionArgs } from "@remix-run/node";
import {
  handleFeedback,
  isFeedbackForm,
} from "~/services/feedback/handleFeedback";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  if (isFeedbackForm(formData)) return handleFeedback(formData, request);
};
