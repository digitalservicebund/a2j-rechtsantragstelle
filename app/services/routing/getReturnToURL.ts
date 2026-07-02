import type { Session } from "react-router";

type GetBackURLSchema = {
  request: Request;
  session: Session;
  url: URL;
};

export const getReturnToURL = ({ request, session, url }: GetBackURLSchema) => {
  const { searchParams, pathname: currentPath } = url;
  const referer = request.headers.get("Referer");

  if (searchParams.get("returnToHere") !== null && referer) {
    // save to session only when returnToHere is present in referer
    const { pathname: refererPath } = new URL(referer);
    session.set(currentPath, refererPath);
  }
  const currentUrl = session.get(currentPath) as string | undefined;
  return { url: currentUrl, session };
};
