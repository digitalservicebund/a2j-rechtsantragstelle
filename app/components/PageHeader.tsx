const headerProps = {
  headerTitle: "Justiz-Services",
  headerURL: "/",
};

export default function Header() {
  const { headerTitle, headerURL } = headerProps;

  return (
    <header className="py-20 px-16">
      <a
        href={headerURL}
        className="ds-label-01-bold no-underline hover:underline mr-8 text-black focus:outline active:underline active:decoration-4"
      >
        {headerTitle}
      </a>
    </header>
  );
}
