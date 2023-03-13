import { Button } from "~/components";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return {};
};

export default function KitchensinkButtons() {
  return (
    <div>
      <h1>Buttons</h1>
      <h2>Primary</h2>
      <Button>Registrieren</Button>
    </div>
  );
}
