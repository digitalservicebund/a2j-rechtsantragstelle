import type { ActionFunctionArgs } from "@remix-run/node";
import Button from "~/components/Button";
import { throw404OnProduction } from "~/services/errorPages/throw404";

export const loader = () => {
  throw404OnProduction();
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  throw404OnProduction();
  console.log(request);
  process.stdout.write(JSON.stringify(await request.formData()) + "\n");
  return null;
};

export default function View() {
  return (
    <div>
      <h1>BundID Success Test</h1>
      <form action={"/bundid/success"} method="post">
        <input type="hidden" name="test" value="HI" />
        <Button type={"submit"}>Mock POST request</Button>
      </form>
    </div>
  );
}
