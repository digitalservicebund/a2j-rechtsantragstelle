import { Button } from "~/components";

export default function KitchensinkButtons() {
  return (
    <div>
      <h1>Buttons</h1>
      <h2>Primary</h2>
      <h3>Large</h3>
      <Button size="large">Registrieren</Button>

      <h3>Medium</h3>
      <Button>Registrieren</Button>

      <h3>Small</h3>
      <Button size="small">Registrieren</Button>

      <h3>Disabled</h3>
      <Button size="small">Registrieren</Button>
    </div>
  );
}
