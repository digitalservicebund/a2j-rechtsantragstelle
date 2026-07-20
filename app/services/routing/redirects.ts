import { isKeyOfObject } from "~/util/objects";

export const redirectMap = {
  "/datenschutz": "/datenschutzerklaerung",
  "/beratungshilfe/datenschutz": "/datenschutzerklaerung",
  "/prozesskostenhilfe/datenschutz": "/datenschutzerklaerung",
  "/fluggastrechte/datenschutz": "/datenschutzerklaerung",
  "/erbschein/nachlassgericht/start":
    "/nachlass/erbschein/nachlassgericht/start",
  "/erbschein/wegweiser/start": "/nachlass/erbschein/wegweiser/start",
  "/erbschein": "/nachlass/erbschein",
} as const;

export const getRedirect = (pathname: string) =>
  isKeyOfObject(pathname, redirectMap) ? redirectMap[pathname] : undefined;
