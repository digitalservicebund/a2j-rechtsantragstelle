import { type ActionFunctionArgs } from "react-router";

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log(request);
  return Promise.resolve("success!");
};
