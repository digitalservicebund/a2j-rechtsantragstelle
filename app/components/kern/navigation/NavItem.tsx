import classNames from "classnames";
import { useId, type FC } from "react";
import { useCollapse } from "react-collapsed";
import {
  stateIsCurrent,
  stateIsActive,
  stateIsDisabled,
  stateIsDone,
  stateIsWarning,
} from "~/services/navigation/navState";
import { translations } from "~/services/translations/translations";
import { NavigationList } from "./NavigationList";
import { type NavItem } from "./types";
import { KernIcon } from "../common/KernIcon";

type StateIconProps = {
  id: string;
  isDone: boolean;
  showWarningIcon?: boolean;
};

const StateIcon: FC<StateIconProps> = ({ id, isDone, showWarningIcon }) => {
  if (isDone) {
    return (
      <KernIcon
        name="check-circle"
        className="fill-kern-feedback-success"
        aria-label={translations.navigation.navigationItemFinished.de}
        size={20}
      />
    );
  } else if (showWarningIcon) {
    return (
      <KernIcon
        name="warning"
        aria-label={translations.navigation.navigationItemWarning.de}
        className="fill-kern-feedback-warning"
        size={20}
      />
    );
  }
  return undefined;
};

export function NavItem({
  destination,
  label,
  state,
  subflows = [],
  forceExpanded,
  isChild = false,
  firstItemRef,
}: Readonly<
  NavItem & {
    isChild?: boolean;
    firstItemRef?: React.RefObject<HTMLAnchorElement | null>;
  }
>) {
  const visibleChildItems = subflows.filter((subItem) =>
    stateIsActive(subItem.state),
  );
  const hasSubflows = visibleChildItems.length > 0;
  const isDisabled = stateIsDisabled(state);
  const isCurrent = stateIsCurrent(state);
  const isDone = stateIsDone(state);
  const isWarning = stateIsWarning(state);
  const collapse = useCollapse({
    defaultExpanded: forceExpanded ?? isCurrent,
  });

  // Transparent last: borders to avoid layout shifts
  const liClassNames = classNames(
    "list-none border-b border-kern-neutral-200 last:border-0 flex w-full flex-col w-fit",
    {
      "text-kern-neutral-400! curser-not-allowed hover:font-normal pointer-events-none":
        isDisabled,
      "border-none": isChild,
      "border-transparent last:border-transparent flex flex-col": isChild,
    },
  );

  const itemClassNames = classNames(
    "w-initial p-16! flex justify-between items-center hover:underline hover:bg-kern-neutral-200 active:bg-kern-neutral-200 kern-body kern-body--small ",
    {
      "kern-alert--warning hover:bg-kern-orange-100!": isWarning,
      "kern-body--bold bg-kern-neutral-100": isCurrent && !hasSubflows,
      "pl-24!": isChild,
      "text-kern-grey-400! curser-not-allowed hover:font-normal pointer-events-none":
        isDisabled,
    },
  );
  const iconId = useId();

  return (
    <li className={liClassNames}>
      {hasSubflows ? (
        <>
          <button
            className={itemClassNames}
            aria-disabled={isDisabled}
            aria-expanded={collapse.isExpanded}
            {...collapse.getToggleProps()}
            // oxlint-disable-next-line aria-role
            role={undefined} // due the rest operator, the role is assigned to the button in the server side rendering
          >
            <span>{label}</span>
            <div className="flex items-center gap-8 justify-end align-end self-end">
              {collapse.isExpanded ? (
                <KernIcon name="keyboard-arrow-up" className="ml-auto" />
              ) : (
                <KernIcon name="keyboard-arrow-down" className="ml-auto" />
              )}
              <StateIcon
                id={iconId}
                isDone={isDone}
                showWarningIcon={isWarning}
              />
            </div>
          </button>
          {
            // due the rest operator, the role is assigned to the section in the server side rendering
          }
          <section
            {...collapse.getCollapseProps()}
            // oxlint-disable-next-line jsx-a11y/aria-role
            role={undefined}
          >
            <NavigationList navItems={visibleChildItems} isChild={true} />
          </section>
        </>
      ) : (
        <a
          href={destination}
          className={itemClassNames}
          aria-disabled={isDisabled}
          aria-current={isCurrent}
          ref={firstItemRef}
          data-testid={"nav-item-link"}
        >
          <span>{label}</span>
          <StateIcon id={iconId} isDone={isDone} showWarningIcon={isWarning} />
        </a>
      )}
    </li>
  );
}
