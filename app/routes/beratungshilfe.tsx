import {
  type LoaderFunctionArgs,
  json,
  ActionFunctionArgs,
} from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { fetchMeta } from "~/services/cms/index.server";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";
import {
  handleFeedback,
  isFeedbackForm,
} from "~/services/feedback/handleFeedback";

export async function loader({ request }: LoaderFunctionArgs) {
  await throw404IfFeatureFlagEnabled(request);
  const { pathname } = new URL(request.url);
  const filterValue = `/${pathname.split("/").at(1) ?? ""}`;
  return json({ meta: await fetchMeta({ filterValue }) });
}

export default function View() {
  return <Outlet />;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  if (isFeedbackForm(formData)) return handleFeedback(formData, request);
};
