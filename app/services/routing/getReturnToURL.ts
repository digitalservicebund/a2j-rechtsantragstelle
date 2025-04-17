import type { Session } from "react-router";

type GetBackURLSchema = {
  request: Request;
  session: Session;
};

export const getReturnToURL = ({ request, session }: GetBackURLSchema) => {
  const { searchParams, pathname: currentPath } = new URL(request.url);
  const referer = request.headers.get("Referer");

  if (searchParams.get("returnToHere") !== null && referer) {
    // save to session only when returnToHere is present in referer
    const { pathname: refererPath } = new URL(referer);
    session.set(currentPath, refererPath);
  }
  const url = session.get(currentPath) as string | undefined;
  return { url, session };
};
