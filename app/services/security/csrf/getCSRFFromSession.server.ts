import type { Session } from "@remix-run/node";
import { CSRFKey } from "./csrfKey";

export const getCSRFFromSession = (session: Session) =>
  session.get(CSRFKey) as string[] | null;
