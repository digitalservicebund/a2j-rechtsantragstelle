import { OpenInNewTabIcon } from "~/components/openInNewTabIcon";
import type { Dependency } from "./generate.server";

const renderLicenseEntry = (dependencyString: string, infos: Dependency) => {
  return (
    <li key={dependencyString}>
      {infos.repository ? (
        <a
          href={infos.repository}
          className="text-link"
          target="_blank"
          rel="noreferrer"
        >
          {dependencyString}
          <OpenInNewTabIcon />
        </a>
      ) : (
        dependencyString
      )}

      {infos.publisher && (
        <>
          {" by "}
          <i>{infos.publisher}</i>
        </>
      )}
      {infos.licenses &&
        infos.licenses.length > 0 &&
        ` - License: ${Array.isArray(infos.licenses) ? infos.licenses.join(", ") : infos.licenses}`}
    </li>
  );
};

type LicenseListProps = {
  readonly dependencies: {
    directDependencies: Record<string, Dependency>;
    mentionableTransitiveDependencies: Record<string, Dependency>;
  };
};

const LicenseList = ({ dependencies }: LicenseListProps) => (
  <div className="ds-stack-8 ">
    <ul>
      {Object.entries(dependencies.directDependencies).map(
        ([dependencyString, infos]) =>
          renderLicenseEntry(dependencyString, infos),
      )}
    </ul>

    {Object.keys(dependencies.mentionableTransitiveDependencies).length > 0 && (
      <ul>
        {Object.entries(dependencies.mentionableTransitiveDependencies).map(
          ([dependencyString, infos]) =>
            renderLicenseEntry(dependencyString, infos),
        )}
      </ul>
    )}
  </div>
);

export default LicenseList;
