import { redirect, type ActionFunctionArgs } from "react-router";

export const loader = () => redirect("/");

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log(formData);
  const returnUrl = formData.get("returnUrl") as string | undefined;
  redirect(returnUrl ?? "/");
};
