import { type Dependency } from "./generate";
import packageLicenses from "./opensource-licenses.json";

const directDependencies = Object.fromEntries(
  Object.entries(packageLicenses).filter(
    ([_, info]) => "direct" in info && info.direct,
  ),
);

const mentionableTransitiveDependencies = Object.fromEntries(
  Object.entries(packageLicenses).filter(
    ([dependency, _]) => !(dependency in directDependencies),
  ),
);

const renderLicenseEntry = (dependencyString: string, infos: Dependency) => {
  const versionSplitIdx = dependencyString.lastIndexOf("@");
  const depencenyName = dependencyString.substring(0, versionSplitIdx);
  return (
    <li key={depencenyName}>
      {infos.repository ? (
        <a href={infos.repository} className="text-link" target="_blank">
          {depencenyName}
        </a>
      ) : (
        depencenyName
      )}

      {infos.publisher && (
        <>
          {" by "}
          <i>{infos.publisher}</i>
        </>
      )}
      <> - License: {infos.licenses}</>
    </li>
  );
};

const LicenseList = () => (
  <div className="ds-stack-8 ">
    <ul>
      {Object.entries(directDependencies).map(([dependencyString, infos]) =>
        renderLicenseEntry(dependencyString, infos),
      )}
    </ul>

    {Object.keys(mentionableTransitiveDependencies).length > 0 && (
      <ul>
        {Object.entries(mentionableTransitiveDependencies).map(
          ([dependencyString, infos]) =>
            renderLicenseEntry(dependencyString, infos),
        )}
      </ul>
    )}
  </div>
);

export default LicenseList;
