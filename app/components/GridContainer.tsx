// components/GridContainer.tsx
import classNames from "classnames";
import type { CSSProperties, PropsWithChildren } from "react";

type Variant = "contained" | "overhang";

// tailwind spacing tokens
type Padding = "0" | "16" | "24" | "32" | "40" | "48" | "56" | "64";

const PAD_MAP: Record<Padding, string> = {
  "0": "pt-0 pb-0",
  "16": "pt-16 pb-16",
  "24": "pt-24 pb-24",
  "32": "pt-32 pb-32",
  "40": "pt-40 pb-40",
  "48": "pt-48 pb-48",
  "56": "pt-56 pb-56",
  "64": "pt-64 pb-64",
};

export type GridContainerProps = PropsWithChildren<{
  cols?: number;
  mdCols?: number;
  lgCols?: number;
  xlCols?: number;
  overhangSpan?: number;
  overhangStart?: number;
  mdOverhangSpan?: number;
  mdOverhangStart?: number;
  lgOverhangSpan?: number;
  lgOverhangStart?: number;
  xlOverhangSpan?: number;
  xlOverhangStart?: number;
  backgroundClass?: string;
  sectionClasses?: string;
  innerClassName?: string;
  variant?: Variant; // 'contained' (default) or 'overhang'
  paddingTop?: Padding;
  paddingBottom?: Padding;
  marginTop?: Padding;
  marginBottom?: Padding;
  className?: string;
  style?: CSSProperties & {
    ["--gap"]?: string;
    ["--cols"]?: string;
  };
  dataTestId?: string;
  id?: string;
}>;

export default function GridContainer({
  children,
  cols = 1,
  mdCols = 8,
  lgCols = 12,
  xlCols = 12,
  backgroundClass,
  sectionClasses,
  innerClassName,
  variant = "contained",
  paddingTop,
  paddingBottom,
  marginTop = "32",
  marginBottom = "32",
  className = "",
  style,
  dataTestId,
  id,
  overhangSpan,
  overhangStart,
  mdOverhangSpan,
  mdOverhangStart,
  lgOverhangSpan,
  lgOverhangStart,
  xlOverhangSpan,
  xlOverhangStart,
}: GridContainerProps) {
  // compute vertical spacing
  const ptCls = paddingTop ? `pt-${paddingTop}` : "";
  const pbCls = paddingBottom ? `pb-${paddingBottom}` : "";
  const mtCls = marginTop ? `mt-${marginTop}` : "";
  const mbCls = marginBottom ? `mb-${marginBottom}` : "";
  // const pxCls = paddingX ? `px-${paddingX}` : "";
  const pxClasses = classNames(
    "px-4", // 16px → S and M
    "lg:px-3", // 12px → L
    "xl:px-8", // 32px → XL
  );
  // baked-in column definitions
  const gridTemplate = classNames(
    // S: 1 col @ 288px
    "grid-cols-[repeat(1,288px)]",
    // M: 8 cols @ 64px
    "md:[grid-template-columns:repeat(8,64px)]",
    // L: 12 cols @ 54px
    "lg:[grid-template-columns:repeat(12,54px)]",
    // XL: 12 cols @ 72px
    "xl:[grid-template-columns:repeat(12,72px)]",
  );

  // baked-in gaps (0 on S/M, 32px on L/XL)
  const gapClasses = classNames("gap-0", "md:gap-8", "lg:gap-8", "xl:gap-8");

  // base grid container: no default paddings/margins
  const inner = classNames(
    "mx-auto max-w-screen-xl",
    "grid [grid-template-columns:repeat(var(--cols,1),minmax(0,1fr))]",
    "md:[--cols:8] lg:[--cols:12]",

    // "[gap:var(--gap,0px)] md:[--gap:32px] lg:[--gap:32px] xl:[--gap:32px]",
    gapClasses,
    "[&>*]:min-w-0",
    ptCls,
    pbCls,
    pxClasses,
    innerClassName,
    // className,
  );
  const varStyle: CSSProperties = {
    ...(style || {}),
    // Set column counts via CSS variables (no safelist needed)
    // ["--cols" as any]: cols,
    ["--cols-md" as any]: mdCols,
    ["--cols-lg" as any]: lgCols,
    ["--cols-xl" as any]: xlCols,
  };

  const baseSectionClasses = classNames(mtCls, mbCls);

  if (variant === "overhang") {
    const isFull =
      overhangSpan == null &&
      mdOverhangSpan == null &&
      lgOverhangSpan == null &&
      xlOverhangSpan == null;

    return (
      // full-bleed section; content width is handled inside
      <section
        className={classNames("relative w-full", sectionClasses)} // no max-w here
        data-testid={dataTestId}
        id={id}
      >
        {/* background is NOT inside the max-width wrapper */}
        {backgroundClass &&
          (isFull ? (
            // truly full viewport width
            <div
              aria-hidden
              className={classNames(
                "absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen",
                backgroundClass,
              )}
            />
          ) : (
            // column-aware span (if you use it)
            <div
              aria-hidden
              className={classNames("overhang-span", backgroundClass)}
              style={
                {
                  ["--span" as any]: overhangSpan ?? 12,
                  ["--span-md" as any]: mdOverhangSpan ?? overhangSpan ?? 12,
                  ["--span-lg" as any]: lgOverhangSpan ?? overhangSpan ?? 12,
                  ["--span-xl" as any]: xlOverhangSpan ?? overhangSpan ?? 12,
                } as CSSProperties
              }
            />
          ))}

        {/* content wrapper is the ONLY thing with max-w */}
        <div
          className={classNames(
            "relative mx-auto max-w-screen-xl",
            mbCls,
            mtCls,
          )}
        >
          <div
            className={inner /* inner MUST NOT re-apply max-w */}
            style={varStyle}
          >
            {children}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={classNames(baseSectionClasses, sectionClasses)} id={id}>
      <div className={classNames(inner, backgroundClass)} style={varStyle}>
        {children}
      </div>
    </section>
  );
}
