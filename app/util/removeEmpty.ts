import { Footer } from "~/services/cms/models/Footer";
import { Navigation } from "~/services/cms/models/Navigation";

type Data =
  | {
      [key: string]: any;
    }
  | null
  | Data[];

export function removeEmpty(data: Data): Data {
  if (!data) return data;

  //transform properties into key-values pairs and filter all the empty-values
  const entries = Object.entries(data).filter(([key, value]) => {
    return value !== null; // && key !== "id" && key !== "__component"
  });

  //map through all the remaining properties and check if the value is an object.
  //if value is object, use recursion to remove empty properties
  const clean = entries.map(([key, v]) => {
    const value = typeof v === "object" ? removeEmpty(v) : v;
    return [key, value];
  });

  if (Array.isArray(data)) {
    // return a "real" array
    return clean.map((p) => p[1]);
  }

  //transform the key-value pairs back to an object.
  return Object.fromEntries(clean);
}
