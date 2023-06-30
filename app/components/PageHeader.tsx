const headerProps = {
  headerTitle: "Justiz-Services",
  headerURL: "/",
};

export default function Header() {
  const { headerTitle, headerURL } = headerProps;

  return (
    <header className="mb-20 mt-20 ml-16">
      <a
        href={headerURL}
        className="ds-label-01-bold no-underline hover:underline mr-8 text-black focus:outline active:underline active:decoration-4"
      >
        {headerTitle}
      </a>
    </header>
  );
}
