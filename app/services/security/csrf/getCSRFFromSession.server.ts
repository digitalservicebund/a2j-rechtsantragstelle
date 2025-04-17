import type { Session } from "react-router";
import { CSRFKey } from "./csrfKey";

export const getCSRFFromSession = (session: Session) =>
  session.get(CSRFKey) as string[] | null;
