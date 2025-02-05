import classNames from "classnames";

export default function Kopfzeile({
  alignToMainContainer = true,
}: Readonly<{ alignToMainContainer?: boolean }>) {
  const containerClassNames = classNames(
    "gap-8 sm:gap-16 flex items-center !py-0 !mx-0",
    {
      "container lg:min-w-[59rem] lg:!mx-auto": alignToMainContainer,
      "px-8 sm:px-[15px]": !alignToMainContainer,
    },
  );
  return (
    <div
      className="flex items-center text-left text-xs sm:text-base"
      style={{
        backgroundColor: "#f0f0f0",
        fontFamily:
          "Fira Sans, Fira Sans Regular, Noto Sans, Noto Sans Regular, SF Pro Text, Segoe UI, SegoeUI, Roboto, Arial, Helvetica, sans-serif",
      }}
    >
      <div className={containerClassNames}>
        <span
          aria-hidden="true"
          className="flex border-solid h-12 w-[18px] sm:w-24 sm:h-16 border-white border"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 16"
          >
            <path fill="#000" d="M0 .5h24v5.333H0z" />
            <path fill="red" d="M0 5.833h24v5.333H0z" />
            <path fill="#FACA2C" d="M0 11.167h24V16.5H0z" />
          </svg>
        </span>
        <span>Eine offizielle Website der Bundesrepublik Deutschland</span>
      </div>
    </div>
  );
}
