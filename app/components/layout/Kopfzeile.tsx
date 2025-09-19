export default function Kopfzeile() {
  return (
    <div
      className="flex items-center gap-8 text-[14px] sm:text-base"
      style={{
        height: "32px", // hard-set the height for robustness
        backgroundColor: "#f0f0f0",
        fontFamily:
          "Fira Sans, Fira Sans Regular, Noto Sans, Noto Sans Regular, SF Pro Text, Segoe UI, SegoeUI, Roboto, Arial, Helvetica, sans-serif",
      }}
    >
      <svg
        aria-hidden="true"
        className="border border-white h-12 sm:h-16"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 16"
        aria-label="Bundesflagge"
      >
        <path fill="#000" d="M0 .5h24v5.333H0z" />
        <path fill="red" d="M0 5.833h24v5.333H0z" />
        <path fill="#FACA2C" d="M0 11.167h24V16.5H0z" />
      </svg>
      <span>Offizielle Website - Bundesrepublik Deutschland</span>
    </div>
  );
}
