import { Gerichte } from "@digitalservicebund/a2j-xjustiz-bridge/nachricht/zahlungsklage";

export function findGerichtByXjustizId(
  xjustizId: string | undefined,
): Gerichte | undefined {
  if (xjustizId === undefined || xjustizId === "") return undefined;
  return Object.values(Gerichte).find(({ code }) => code === xjustizId);
}
