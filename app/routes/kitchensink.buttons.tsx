import { Button } from "~/components";
import Close from "@mui/icons-material/Close";

export default function KitchensinkButtons() {
  return (
    <div>
      <h1>Buttons</h1>
      <h2>Primary (default)</h2>
      <h3>Large</h3>
      <div className="mb-4">
        <Button size="large">Registrieren</Button>
        <br />
      </div>
      <div className="mb-4">
        <Button size="large" iconLeft={<Close />}>
          Registrieren
        </Button>
      </div>
      <div className="mb-4">
        <Button size="large" iconRight={<Close />}>
          Registrieren
        </Button>
      </div>
      <div>
        <Button size="large" iconRight={<Close />} aria-label="Registrieren" />
      </div>

      <h3>Medium (default)</h3>
      <div className="mb-4">
        <Button>Registrieren</Button>
      </div>
      <div className="mb-4">
        <Button iconLeft={<Close />}>Registrieren</Button>
      </div>
      <div className="mb-4">
        <Button iconRight={<Close />}>Registrieren</Button>
      </div>
      <div>
        <Button iconRight={<Close />} aria-label="Registrieren" />
      </div>

      <h3>Small</h3>
      <div className="mb-4">
        <Button size="small">Registrieren</Button>
        <br />
      </div>
      <div className="mb-4">
        <Button size="small" iconLeft={<Close />}>
          Registrieren
        </Button>
      </div>
      <div className="mb-4">
        <Button size="small" iconRight={<Close />}>
          Registrieren
        </Button>
      </div>
      <div>
        <Button size="small" iconRight={<Close />} aria-label="Registrieren" />
      </div>

      <h3>Disabled</h3>
      <div className="mb-4">
        <Button disabled>Registrieren</Button>
        <br />
      </div>
      <div className="mb-4">
        <Button disabled iconLeft={<Close />}>
          Registrieren
        </Button>
      </div>
      <div className="mb-4">
        <Button disabled iconRight={<Close />}>
          Registrieren
        </Button>
      </div>
      <div>
        <Button disabled iconRight={<Close />} aria-label="Registrieren" />
      </div>

      <h3>Full Width</h3>
      <div className="mb-4">
        <Button fullWidth size="large">
          Registrieren
        </Button>
        <br />
      </div>
      <div className="mb-4">
        <Button fullWidth iconLeft={<Close />}>
          Registrieren
        </Button>
      </div>
      <div className="mb-4">
        <Button fullWidth size="small" iconRight={<Close />}>
          Registrieren
        </Button>
      </div>
      <div>
        <Button
          fullWidth
          size="small"
          iconRight={<Close />}
          aria-label="Registrieren"
        />
      </div>
      <h2>Andere Looks</h2>
      <div className="mb-4">
        <Button look="secondary">Registrieren</Button>
      </div>
      <div className="mb-4">
        <Button look="tertiary" iconLeft={<Close />}>
          Registrieren
        </Button>
      </div>
      <div className="mb-4">
        <Button look="ghost" iconRight={<Close />}>
          Registrieren
        </Button>
      </div>
    </div>
  );
}
