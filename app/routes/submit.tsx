import { Form, useActionData } from "@remix-run/react";
import { submit } from "~/services/flow/submission.server";
import Button from "../components/Button";

export const action = async () => await submit();

export default function Index() {
  const data = useActionData<typeof action>();

  return (
    <>
      <Form method="POST">
        <Button className="m-20" text="submit to Fit-Connect" />
      </Form>
      {data && <span className="pl-20">{data}</span>}
    </>
  );
}
