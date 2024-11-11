import { Link } from "@remix-run/react";
import { useLayoutEffect, useState } from "react";

export function SkipToContentLink({
  label,
}: Readonly<{
  label: string;
}>) {
  const [target, setTarget] = useState("main");

  // useLayoutEffect is necessary here, as we can't use `document` in an SSR environemnt
  useLayoutEffect(() => {
    if (document.getElementById("form-flow-page-content")) {
      setTarget("form-flow-page-content");
    }
  }, []);

  return (
    <Link
      to={`#${target}`}
      className="bg-yellow-300 px-8 py-6 text-blue-800 ds-label-01-reg"
      id="skip-to-content-link"
    >
      {label}
    </Link>
  );
}
