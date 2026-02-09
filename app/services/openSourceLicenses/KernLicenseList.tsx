import { KernIcon } from "~/components/kern/common/KernIcon";
import { StandaloneLink } from "../../components/common/StandaloneLink";

type Dependency = {
  licenses: string | string[];
  publisher?: string;
  repository?: string;
};

const renderLicenseEntry = (dependencyString: string, infos: Dependency) => {
  return (
    <li key={dependencyString} className="flex">
      {infos.repository ? (
        <a className="kern-link min-h-[24px] no-underline! p-0!" href={infos.repository}>
          <KernIcon name="open-in-new" className="w-[1.2em] h-[1.2em]" />
          {dependencyString}
        </a>
      ) : (
        dependencyString
      )}

      {infos.publisher && (
        <span className="ml-4">
         by {infos.publisher}
        </span>
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

const KernLicenseList = ({ dependencies }: LicenseListProps) => (
  <div className="ds-stack ds-stack-8 ">
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

export default KernLicenseList;
