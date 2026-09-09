import { isKeyOfObject } from "~/util/objects";

export const redirectMap = {
  "/datenschutz": "/datenschutzerklaerung",
  "/beratungshilfe/datenschutz": "/datenschutzerklaerung",
  "/prozesskostenhilfe/datenschutz": "/datenschutzerklaerung",
  "/fluggastrechte/datenschutz": "/datenschutzerklaerung",
  "/nachlass/erbschein/nachlassgericht/start":
    "/erbschein/nachlassgericht/start",
  "/nachlass/erbschein/wegweiser/start": "/erbschein/wegweiser/start",
  "/nachlass/erbschein": "/erbschein",
  "/nachlass/erbausschlagung": "/erbausschlagung",
  "/nachlass/erbausschlagung/gericht-finden/start":
    "/erbausschlagung/gericht-finden/start",
  "/nachlass/erbausschlagung/anfrage/start/start":
    "/erbausschlagung/anfrage/start/start",
} as const;

export const getRedirect = (pathname: string) =>
  isKeyOfObject(pathname, redirectMap) ? redirectMap[pathname] : undefined;
