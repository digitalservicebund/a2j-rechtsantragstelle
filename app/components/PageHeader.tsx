// TODO: Move to CMS
const headerProps = {
  headerTitle: "Justiz-Services",
  headerLinkLabel: "Justiz Service - Zurück zur Startseite",
};

export default function Header() {
  const { headerTitle, headerLinkLabel } = headerProps;

  return (
    <header className="py-20 px-16">
      <a
        href="/"
        className="ds-label-01-bold no-underline hover:underline mr-8 text-black focus:outline active:underline active:decoration-4"
        aria-label={headerLinkLabel}
      >
        {headerTitle}
      </a>
    </header>
  );
}
