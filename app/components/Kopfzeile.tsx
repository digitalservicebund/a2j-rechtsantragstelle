export default function Kopfzeile() {
  return (
    <div
      className="px-16 flex items-center text-left gap-8 sm:gap-16 text-xs sm:text-base"
      style={{
        backgroundColor: "#f0f0f0",
        fontFamily: "FiraSans, Calibri, Verdana, Arial, Helvetica, sans-serif",
      }}
    >
      <span
        aria-hidden="true"
        className="flex border-solid h-12 sm:h-16 border-white border"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 16">
          <path fill="#000" d="M0 .5h24v5.333H0z" />
          <path fill="red" d="M0 5.833h24v5.333H0z" />
          <path fill="#FACA2C" d="M0 11.167h24V16.5H0z" />
        </svg>
      </span>
      <span>Eine offizielle Website der Bundesrepublik Deutschland</span>
    </div>
  );
}
