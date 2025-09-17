import classNames from "classnames";
import { NavState } from "~/services/navigation/navState";

type Props = {
  steppers: Array<{
    label: string;
    href: string;
    state: NavState;
  }>;
};

export const FlowStepperNavigation = ({ steppers }: Props) => {
  return (
    <nav className="w-full pb-24">
      <ol className={"flex max-w-full! pl-0 nav-steps"}>
        {steppers.map((stepper, index) => {
          const isCurrent =
            stepper.state === "Current" || stepper.state === "DoneCurrent";

          return (
            <li
              key={stepper.label}
              className={classNames(
                "flex w-full border border-blue-500 step not-[&:last-child]:border-r-0 not-[&:first-child]:border-l-0 arrow-step",
                {
                  "bg-blue-300 ds-label-03-bold": isCurrent,
                  "ds-label-03-reg": !isCurrent,
                  "bg-gray-100 text-gray-600 curser-not-allowed pointer-events-none":
                    stepper.state === "Disabled",
                },
              )}
            >
              <a
                href={stepper.href}
                className="w-full p-16 flex gap-8 justify-center items-center text-center hover:underline hover:bg-blue-400 active:bg-blue-300 focus-visible:shadow-[inset_0px_0px_0px_4px] focus:shadow-blue-300"
                aria-disabled={stepper.state === "Disabled"}
                aria-current={isCurrent}
              >
                <span
                  className={classNames(
                    "flex justify-center items-center w-[24px] h-[24px] rounded-full mr-3",
                    {
                      "bg-blue-800 text-white": isCurrent,
                      "border border-gray-600": stepper.state === "Disabled",
                    },
                  )}
                >
                  {index + 1}
                </span>
                <span>{stepper.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
