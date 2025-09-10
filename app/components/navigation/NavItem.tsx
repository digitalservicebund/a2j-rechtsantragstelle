import CheckCircle from "@digitalservicebund/icons/CheckCircle";
import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";
import SvgWarningAmber from "@digitalservicebund/icons/WarningAmber";
import classNames from "classnames";
import { useId, type FC } from "react";
import { useCollapse } from "react-collapsed";
import {
  stateIsCurrent,
  stateIsActive,
  stateIsDisabled,
  stateIsDone,
} from "~/services/navigation/navState";
import { translations } from "~/services/translations/translations";
import { NavigationList } from "./NavigationList";
import { type NavItem } from "./types";

type StateIconProps = {
  id: string;
  isDone: boolean;
  showWarningIcon?: boolean;
};

const StateIcon: FC<StateIconProps> = ({ id, isDone, showWarningIcon }) => {
  if (isDone) {
    return (
      <CheckCircle
        id={id}
        className="shrink-0 fill-green-700"
        aria-label={translations.navigation.navigationItemFinished.de}
      />
    );
  } else if (showWarningIcon) {
    return (
      <SvgWarningAmber
        id={id}
        aria-label={translations.navigation.navigationItemWarning.de}
      />
    );
  }
  return undefined;
};

export function NavItem({
  destination,
  label,
  excludedFromValidation,
  userVisitedValidationPage,
  state,
  subflows = [],
  forceExpanded,
  isChild = false,
}: Readonly<NavItem & { isChild?: boolean }>) {
  const visibleChildItems = subflows.filter((subItem) =>
    stateIsActive(subItem.state),
  );
  const hasSubflows = visibleChildItems.length > 0;
  const isDisabled = stateIsDisabled(state);
  const isCurrent = stateIsCurrent(state);
  const isDone = stateIsDone(state);
  const collapse = useCollapse({
    defaultExpanded: forceExpanded ?? isCurrent,
  });
  const showWarningIcon =
    userVisitedValidationPage && !excludedFromValidation && !isDone;

  // Transparent last: borders to avoid layout shifts
  const liClassNames = classNames(
    "list-none border-b border-blue-400 last:border-0 min-w-full",
    {
      "text-gray-600 curser-not-allowed hover:font-normal pointer-events-none":
        isDisabled,
      "border-transparent last:border-transparent": isChild,
    },
  );

  const itemClassNames = classNames(
    "w-full p-16 flex justify-between items-center hover:underline hover:bg-blue-400 active:bg-blue-300 focus-visible:shadow-[inset_0px_0px_0px_4px] focus:shadow-blue-300",
    {
      "bg-yellow-200 hover:bg-yellow-300 active:bg-yellow-300": showWarningIcon,
      "bg-yellow-300": isCurrent && showWarningIcon,
      "ds-label-02-bold bg-blue-400": isCurrent && !hasSubflows,
      "ds-label-02-reg": !isCurrent || hasSubflows,
      "pl-24": isChild,
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
            aria-describedby={isDone ? iconId : undefined}
            // oxlint-disable-next-line aria-role
            role={undefined} // due the rest operator, the role is assigned to the button in the server side rendering
          >
            {label}
            {collapse.isExpanded ? (
              <ExpandLessIcon className="ml-auto" />
            ) : (
              <ExpandMoreIcon className="ml-auto" />
            )}
            <StateIcon
              id={iconId}
              isDone={isDone}
              showWarningIcon={showWarningIcon}
            />
          </button>
          {
            // due the rest operator, the role is assigned to the section in the server side rendering
          }
          <section
            {...collapse.getCollapseProps()}
            // oxlint-disable-next-line jsx-a11y/aria-role
            role={undefined}
          >
            <NavigationList
              navItems={visibleChildItems}
              isChild={true}
              userVisitedValidationPage={userVisitedValidationPage}
            />
          </section>
        </>
      ) : (
        <a
          href={destination}
          className={itemClassNames}
          aria-disabled={isDisabled}
          aria-current={isCurrent}
          aria-describedby={isDone ? iconId : undefined}
        >
          {label}
          <StateIcon
            id={iconId}
            isDone={isDone}
            showWarningIcon={showWarningIcon}
          />
        </a>
      )}
    </li>
  );
}
