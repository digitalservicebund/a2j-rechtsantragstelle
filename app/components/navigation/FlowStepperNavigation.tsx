import classNames from "classnames";
import { type NavState } from "~/services/navigation/navState";

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
                "flex w-full border border-blue-500 arrow-step hover:underline hover:bg-blue-400",
                {
                  "bg-white arrow-step-open": stepper.state === "Open",
                  "bg-blue-300 ds-label-03-bold": isCurrent,
                  "ds-label-03-reg": !isCurrent,
                  "bg-gray-100 text-gray-600 curser-not-allowed pointer-events-none arrow-step-disabled":
                    stepper.state === "Disabled",
                },
              )}
            >
              <a
                href={stepper.href}
                className="w-full p-16 flex gap-8 justify-center items-center text-center focus-visible:shadow-[inset_0px_0px_0px_4px] focus:shadow-blue-300"
                aria-disabled={stepper.state === "Disabled"}
                aria-current={isCurrent}
              >
                <span
                  className={classNames(
                    "flex justify-center items-center w-[24px] h-[24px] rounded-full mr-3",
                    {
                      "bg-blue-800 text-white": isCurrent,
                      "border border-gray-600":
                        stepper.state === "Disabled" ||
                        stepper.state === "Open",
                    },
                  )}
                >
                  {index + 1}
                </span>
                <span>{stepper.label}</span>
              </a>

              {index !== steppers.length - 1 && (
                <svg
                  className="triangle"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <polygon points="0,0 100,50 0,100" />
                  <path
                    className="text-blue-500 stroke-current stroke-3"
                    d="M100 50 L0 0 M100 50 L0 100"
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
