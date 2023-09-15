import fs from "node:fs";
import { init } from "license-checker-rseidelsohn";
import type { ModuleInfos, InitOpts } from "license-checker-rseidelsohn";

export type Dependency = ModuleInfos[0] & { direct?: boolean };

const filepath = `${__dirname}/opensource-licenses.json`;
const packageName = "a2j-rechtsantragstelle";
const notMentionableLicenses = [
  "MIT",
  "MIT*",
  "Apache-2.0",
  "Apache-2.0*",
  "BSD-3-Clause",
  "ISC",
  "BSD-2-Clause",
  "(Apache-2.0 AND MIT)",
  "(Unlicense OR Apache-2.0)",
  "Python-2.0",
  "Unlicense",
  "BlueOak-1.0.0",
  "CC0-1.0",
  "0BSD",
  "(MIT OR CC0-1.0)",
];

async function licensesFromPackageJson(direct = false): Promise<ModuleInfos> {
  const opts = {
    start: "./",
    production: true,
    // @ts-ignore, due to bug in API: https://github.com/RSeidelsohn/license-checker-rseidelsohn/issues/83
    direct: direct ? 0 : undefined,
  } satisfies InitOpts;

  return new Promise((resolve, reject) => {
    const callback = (err: Error, ret: ModuleInfos) => {
      if (err !== null) reject(err);
      resolve(ret);
    };
    // @ts-ignore, see above
    init(opts, callback);
  });
}

const licenseMentionable = (dependency: Dependency) =>
  dependency.direct ||
  !(
    typeof dependency.licenses === "string" &&
    notMentionableLicenses.includes(dependency.licenses)
  );

const stripLocalPath = (path: string) =>
  path.substring(path.indexOf(packageName));

export async function allRelevantLicenses(path = "./") {
  const [licenses, directLicenses] = (await Promise.all([
    licensesFromPackageJson(),
    licensesFromPackageJson(true),
  ])) as [Record<string, Dependency>, ModuleInfos];

  for (const directDependency of Object.keys(directLicenses)) {
    licenses[directDependency]["direct"] = true;
  }

  return Object.fromEntries(
    Object.entries(licenses)
      .filter(([_, dep]) => licenseMentionable(dep))
      .map(([name, dependency]) => [
        name,
        {
          ...dependency,
          path: stripLocalPath(dependency.path ?? ""),
          licenseFile: stripLocalPath(dependency.licenseFile ?? ""),
        },
      ]),
  );
}

async function updateLicenseList() {
  const licenses = await allRelevantLicenses();
  const licenseCount = Object.keys(licenses).length;
  const directLicenses = Object.values(licenses).filter((val) => val.direct);
  console.log(
    `Including ${licenseCount} production dependencies (${directLicenses.length} direct dependencies)`,
  );
  fs.writeFileSync(filepath, JSON.stringify(licenses));
}

if (process.argv[2] === "generateLicenseFile") updateLicenseList();
