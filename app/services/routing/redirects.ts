import { isKeyOfObject } from "~/util/objects";

export const redirectMap = {
  "/datenschutz": "/datenschutzerklaerung",
  "/beratungshilfe/datenschutz": "/datenschutzerklaerung",
  "/prozesskostenhilfe/datenschutz": "/datenschutzerklaerung",
  "/fluggastrechte/datenschutz": "/datenschutzerklaerung",
} as const;

export const getRedirect = (pathname: string) =>
  isKeyOfObject(pathname, redirectMap) ? redirectMap[pathname] : undefined;
