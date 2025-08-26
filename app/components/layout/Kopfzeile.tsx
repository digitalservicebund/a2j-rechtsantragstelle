import { alignToContainer } from "~/components";

export default function Kopfzeile() {
  return (
    <div
      className="h-[32px] flex flex-col justify-center text-[14px] sm:text-base"
      style={{
        backgroundColor: "#f0f0f0",
        fontFamily:
          "Fira Sans, Fira Sans Regular, Noto Sans, Noto Sans Regular, SF Pro Text, Segoe UI, SegoeUI, Roboto, Arial, Helvetica, sans-serif",
      }}
    >
      <div
        className={`gap-8 sm:gap-16 flex items-center py-0! ${alignToContainer}`}
      >
        <svg
          aria-hidden="true"
          className="flex border-solid h-12 w-[18px] sm:w-24 sm:h-16 border-white border"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 16"
          data-testid="kopfzeileIcon"
        >
          <path fill="#000" d="M0 .5h24v5.333H0z" />
          <path fill="red" d="M0 5.833h24v5.333H0z" />
          <path fill="#FACA2C" d="M0 11.167h24V16.5H0z" />
        </svg>

        <span>Offizielle Website - Bundesrepublik Deutschland</span>
      </div>
    </div>
  );
}
