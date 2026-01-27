import { KernIcon } from "../common/KernIcon";

export function KernSkipToContentLink({
  label,
  target,
}: Readonly<{
  label: string;
  target: string;
}>) {
  return (
    <a
      href={target}
      className="bg-kern-yellow-100 px-8 flex py-6 text-kern-action-default outline-none absolute transform -translate-y-full focus:translate-y-0 focus:relative"
      id="skip-to-content-link"
    >
      <KernIcon name="arrow-downward" />
      {label}
    </a>
  );
}
