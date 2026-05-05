import KernButton from "../kern/KernButton";
export function SkipToContentLink({
  label,
  target,
}: Readonly<{
  label: string;
  target: string;
}>) {
  return (
    <div
      id="skip-to-content-link"
      className="flex justify-center absolute pt-kern-space-default left-1/2 -translate-x-1/2 -translate-y-full focus-within:translate-y-0 z-11"
    >
      <KernButton href={target} text={label} />
    </div>
  );
}
