import { useRouteLoaderData } from "react-router";
import { type RootLoader } from "~/root";
import { CSRFKey } from "~/services/security/csrf/csrfKey";

export const Csrf = () => {
  const csrf = useRouteLoaderData<RootLoader>("root")?.csrf;
  return (
    <input type="hidden" name={CSRFKey} value={csrf} data-testid={CSRFKey} />
  );
};
