import classNames from "classnames";
import { alignToContainer, GridContainer, GridItem } from "~/components";

export default function Kopfzeile({
  alignToMainContainer = true,
}: Readonly<{ alignToMainContainer?: boolean }>) {
  const containerClassNames = classNames(
    "gap-8 sm:gap-16 flex items-center !py-0 !mx-0",
  );
  return (
    // <div
    //   className="flex items-center text-left text-xs sm:text-base"
    //   data-testid="kopfzeile"
    //   style={{
    //     backgroundColor: "#f0f0f0",
    //     fontFamily:
    //       "Fira Sans, Fira Sans Regular, Noto Sans, Noto Sans Regular, SF Pro Text, Segoe UI, SegoeUI, Roboto, Arial, Helvetica, sans-serif",
    //   }}
    // >
    <GridContainer
      columns={12}
      maxWidth="xl"
      style={{
        backgroundColor: "#f0f0f0",
        fontFamily:
          "Fira Sans, Fira Sans Regular, Noto Sans, Noto Sans Regular, SF Pro Text, Segoe UI, SegoeUI, Roboto, Arial, Helvetica, sans-serif",
      }}
    >
      <GridItem
        span={1}
        spanXs={12}
        spanSm={12}
        spanMd={8}
        spanLg={8}
        colStart={1}
        colStartXs={1}
        colStartSm={1}
        colStartMd={1}
        colStartLg={1}
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
      </GridItem>
    </GridContainer>
    // </div>
  );
}
