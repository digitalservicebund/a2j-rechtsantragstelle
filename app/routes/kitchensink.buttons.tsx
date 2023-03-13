import { Button } from "~/components";

export default function KitchensinkButtons() {
  const Cross = () => {
    return (
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M28.5 9.615L26.385 7.5L18 15.885L9.615 7.5L7.5 9.615L15.885 18L7.5 26.385L9.615 28.5L18 20.115L26.385 28.5L28.5 26.385L20.115 18L28.5 9.615Z" />
      </svg>
    );
  };

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
        <Button size="large" iconLeft={<Cross />}>
          Registrieren
        </Button>
      </div>
      <div className="mb-4">
        <Button size="large" iconRight={<Cross />}>
          Registrieren
        </Button>
      </div>
      <div>
        <Button size="large" iconRight={<Cross />} aria-label="Registrieren" />
      </div>

      <h3>Medium (default)</h3>
      <div className="mb-4">
        <Button>Registrieren</Button>
      </div>
      <div className="mb-4">
        <Button iconLeft={<Cross />}>Registrieren</Button>
      </div>
      <div className="mb-4">
        <Button iconRight={<Cross />}>Registrieren</Button>
      </div>
      <div>
        <Button iconRight={<Cross />} aria-label="Registrieren" />
      </div>

      <h3>Small</h3>
      <div className="mb-4">
        <Button size="small">Registrieren</Button>
        <br />
      </div>
      <div className="mb-4">
        <Button size="small" iconLeft={<Cross />}>
          Registrieren
        </Button>
      </div>
      <div className="mb-4">
        <Button size="small" iconRight={<Cross />}>
          Registrieren
        </Button>
      </div>
      <div>
        <Button size="small" iconRight={<Cross />} aria-label="Registrieren" />
      </div>

      <h3>Disabled</h3>
      <div className="mb-4">
        <Button disabled>Registrieren</Button>
        <br />
      </div>
      <div className="mb-4">
        <Button disabled iconLeft={<Cross />}>
          Registrieren
        </Button>
      </div>
      <div className="mb-4">
        <Button disabled iconRight={<Cross />}>
          Registrieren
        </Button>
      </div>
      <div>
        <Button disabled iconRight={<Cross />} aria-label="Registrieren" />
      </div>

      <h3>Full Width</h3>
      <div className="mb-4">
        <Button fullWidth size="large">
          Registrieren
        </Button>
        <br />
      </div>
      <div className="mb-4">
        <Button fullWidth iconLeft={<Cross />}>
          Registrieren
        </Button>
      </div>
      <div className="mb-4">
        <Button fullWidth size="small" iconRight={<Cross />}>
          Registrieren
        </Button>
      </div>
      <div>
        <Button
          fullWidth
          size="small"
          iconRight={<Cross />}
          aria-label="Registrieren"
        />
      </div>
      <h2>Andere Looks</h2>
      <div className="mb-4">
        <Button look="secondary">Registrieren</Button>
      </div>
      <div className="mb-4">
        <Button look="tertiary" iconLeft={<Cross />}>
          Registrieren
        </Button>
      </div>
      <div className="mb-4">
        <Button look="ghost" iconRight={<Cross />}>
          Registrieren
        </Button>
      </div>
    </div>
  );
}
