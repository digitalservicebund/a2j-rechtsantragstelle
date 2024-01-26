import packageLicenses from "./opensource-licenses.json";

const directDependencies = Object.fromEntries(
  Object.entries(packageLicenses).filter(
    ([_, info]) => "direct" in info && info.direct,
  ),
);

export const dependencies = {
  directDependencies,
  mentionableTransitiveDependencies: Object.fromEntries(
    Object.entries(packageLicenses).filter(
      ([dependency, _]) => !(dependency in directDependencies),
    ),
  ),
};
