export function SkipToContentLink({
  label,
  target,
}: Readonly<{
  label: string;
  target: string;
}>) {
  return (
    <a
      href={target}
      className="bg-yellow-300 px-8 py-6 text-blue-800 ds-label-01-reg absolute transform -translate-y-full focus:translate-y-0 focus:relative"
      id="skip-to-content-link"
    >
      {label}
    </a>
  );
}
