import type {
  TypInfo,
  Jmtd14VTErwerberGerbeh,
  Jmtd14VTErwerberPlzstrn,
  Jmtd14VTErwerberPlzortk,
} from "./types";
import { objectMap, isKeyOfObject } from "../../util/objects";

export type GerbehFile = Record<string, Jmtd14VTErwerberGerbeh | undefined>;
export type PlzOrtkFile = Record<string, Jmtd14VTErwerberPlzortk[]>;
export type PlzStrnFile = Record<string, Jmtd14VTErwerberPlzstrn[]>;

export type GerbehIndex = {
  LKZ: string;
  OLG: string;
  LG: string;
  AG: string;
  typInfo: TypInfo;
};

export function gerbehIndex(info: GerbehIndex) {
  const typInfo = info.typInfo.replace(/ /g, "").toLowerCase();
  return `${info.LKZ}_${info.OLG}_${info.LG}_${info.AG}_${typInfo}`;
}
type ConversionInput = Record<string, unknown[]>;

export const conversions = {
  "JMTD14_VT_ERWERBER_GERBEH_DATA_TABLE.json": (object: ConversionInput) => {
    return Object.fromEntries(
      (object.JMTD14_VT_ERWERBER_GERBEH as Jmtd14VTErwerberGerbeh[])
        .filter((entry) => entry.TYP_INFO == "Zivilgericht - Amtsgericht")
        .map((entry) => [
          gerbehIndex({
            LKZ: entry.LKZ,
            OLG: entry.OLG,
            LG: entry.LG,
            AG: entry.AG,
            typInfo: entry.TYP_INFO,
          }),
          entry,
        ]),
    );
  },

  "JMTD14_VT_ERWERBER_PLZORTK_DATA_TABLE.json": (object: ConversionInput) => {
    const out: PlzOrtkFile = {};
    const plzOrtkData =
      object.JMTD14_VT_ERWERBER_PLZORTK as Jmtd14VTErwerberPlzortk[];

    plzOrtkData.forEach((entry) => {
      if (entry.ANGELEGENHEIT_INFO === "Prozesskostenhilfe eingehend") {
        if (entry.PLZ in out) {
          out[entry.PLZ].push(entry);
        } else {
          out[entry.PLZ] = [entry];
        }
      }
    });
    return out;
  },

  "JMTD14_VT_ERWERBER_PLZSTRN_DATA_TABLE.json": (object: ConversionInput) => {
    const out: PlzStrnFile = {};
    const plzStrnData =
      object.JMTD14_VT_ERWERBER_PLZSTRN as Jmtd14VTErwerberPlzstrn[];

    plzStrnData.forEach((entry) => {
      if (entry.ANGELEGENHEIT_INFO === "Prozesskostenhilfe eingehend") {
        if (entry.PLZ in out) {
          out[entry.PLZ].push(entry);
        } else {
          out[entry.PLZ] = [entry];
        }
      }
    });
    return out;
  },
} as const;

export function applyDataConversions(data: Record<string, ConversionInput>) {
  return objectMap(data, (entry, key) =>
    isKeyOfObject(key, conversions) ? conversions[key](entry) : {},
  );
}
