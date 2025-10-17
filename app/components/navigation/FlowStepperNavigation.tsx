import classNames from "classnames";
import { type NavState } from "~/services/navigation/navState";
import CheckCircle from "@digitalservicebund/icons/CheckCircle";

type Props = {
  steps: Array<{
    label: string;
    href: string;
    state: NavState;
  }>;
};

const Triangle = ({
  state,
}: Readonly<{
  state: NavState;
}>) => (
  <svg
    className={classNames(
      "triangle z-1 h-full absolute right-[-1.25rem] w-[1.25rem] text-blue-400",
      {
        "text-white": state === "Open" || state === "Done",
        "text-gray-100": state === "Disabled",
      },
    )}
    viewBox="1 0 100 100"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <polygon
      className="forced-colors:fill-[ButtonFace]"
      points="0,0 100,50 0,100"
    />
    <path
      className="text-blue-500 stroke-current stroke-3 forced-colors:stroke-[ButtonText]"
      d="M100 50 L0 0 M100 50 L0 100"
    />
  </svg>
);

function Content({
  state,
  label,
  index,
}: Readonly<{
  state: NavState;
  label: string;
  index: number;
}>) {
  return (
    <>
      <span
        className={classNames(
          "flex justify-center items-center w-[20px] h-[20px] rounded-full mr-3 forced-colors:outline-solid forced-colors:border-0",
          {
            "bg-blue-800 text-white": state === "Current",
            "border border-gray-600": state === "Open",
            "bg-gray-600 text-white": state === "Disabled",
          },
        )}
      >
        {state === "DoneCurrent" || state === "Done" ? (
          <CheckCircle className="shrink-0 fill-green-700" />
        ) : (
          index + 1
        )}
      </span>
      <span className="hover:underline">{label}</span>
    </>
  );
}

export const FlowStepperNavigation = ({ steps }: Props) => {
  return (
    <nav className="w-full">
      <ol className={"flex max-w-full! pl-0"}>
        {steps.map(({ state, href, label }, index) => {
          const isCurrent = state === "Current" || state === "DoneCurrent";

          return (
            <li
              key={label}
              className={classNames(
                "arrow-step border border-blue-500 border-r-0 not-[&:first-child]:border-l-0 flex w-full relative active:bg-blue-300",
                {
                  "bg-white": state === "Open" || state === "Done",
                  "bg-blue-400 ds-label-03-bold": isCurrent,
                  "ds-label-03-reg": !isCurrent,
                  "bg-blue-100 text-gray-600 curser-not-allowed pointer-events-none":
                    state === "Disabled",
                },
              )}
            >
              <a
                href={href}
                className="w-full p-14 flex gap-8 justify-center items-center text-center outline-none"
                aria-disabled={state === "Disabled"}
                aria-current={isCurrent}
              >
                <Content index={index} label={label} state={state} />
              </a>
              <Triangle state={state} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
