#!/usr/bin/env node
const fs = require("fs");

var exec = require("child_process").exec;

exec(`license-checker-rseidelsohn`, function (error, stdOut, stdErr) {
  fs.readFile("package.json", "utf8", (err, data) => {
    const packageJson = JSON.parse(data);
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

    const packageLicenses = parsePackageLicenses(stdOut);

    let extractDependency = function ([packageName, packageVersion]) {
      return {
        packageName,
        packageVersion,
      };
    };

    const dependencies = Object.entries(packageJson.dependencies).map(
      extractDependency,
    );

    const licenses = {};
    dependencies.forEach((dependency) => {
      const packageName = dependency.packageName;
      const license = getPackageLicense(packageName, packageLicenses);
      if (!licenses[license]) {
        licenses[license] = [];
      }

      licenses[license].push(packageName);
    });

    Object.keys(packageLicenses).forEach((packageName) => {
      const license = packageLicenses[packageName].licenses;
      if (
        !Object.keys(licenses).includes(packageName) &&
        !notMentionableLicenses.includes(license)
      ) {
        if (!licenses[license]) {
          licenses[license] = [];
        }

        licenses[license].push(packageName);
      }
    });

    fs.writeFileSync(
      "app/package-licenses.json",
      JSON.stringify(licenses, null, 2),
    );
  });
});

function parsePackageLicenses(packageLicenseOutput) {
  const lines = packageLicenseOutput.split("\n");

  const packageLicenses = {};
  let currentPackage;

  for (const line of lines) {
    packageLicenses;
    if (line.startsWith("├─") || line.startsWith("└─")) {
      currentPackage = line.slice(line.indexOf(" ") + 1, line.lastIndexOf("@"));
      packageLicenses[currentPackage] = {};
    } else if (line.includes(":")) {
      const [key, value] = line
        .slice(6)
        .split(":")
        .map((item) => item.trim());
      packageLicenses[currentPackage][key] = value;
    }
  }

  return packageLicenses;
}

function getPackageLicense(packageName, packageLicenses) {
  if (packageName in packageLicenses) {
    const packageInfo = packageLicenses[packageName];
    return packageInfo.licenses;
  }
  return null;
}
