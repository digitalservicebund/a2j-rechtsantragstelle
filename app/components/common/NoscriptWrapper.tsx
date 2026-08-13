export const NoscriptWrapper = ({
  jsAvailable,
  children,
}: {
  jsAvailable: boolean;
  children: React.ReactNode;
}) => (jsAvailable ? <div>{children}</div> : <noscript>{children}</noscript>);
