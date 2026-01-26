import { useRouteLoaderData } from "react-router";
import { type RootLoader } from "~/root";
import { type PropsWithChildren } from "react";

export default function FlowNavigation({
  children,
}: Readonly<PropsWithChildren>) {
  const rootLoaderData = useRouteLoaderData<RootLoader>("root");

  return (
    <aside>
      <nav
        aria-label={rootLoaderData?.accessibilityTranslations?.navigationLabel}
        className={
          "fixed left-0 bottom-0 z-50 w-full lg:border lg:static lg:z-auto lg:border-blue-400 print:hidden"
        }
      >
        {children}
      </nav>
    </aside>
  );
}
