// components/GridContainer.tsx
import classNames from "classnames";
import type { CSSProperties, PropsWithChildren } from "react";

type Variant = "contained" | "overhang";
type Padding = "0" | "16" | "24" | "32" | "40" | "48" | "56" | "64";
const PADS: Record<Padding, string> = {
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
  /** Background utility classes (e.g., 'bg-blue-900 text-white') */
  backgroundClass?: string;
  /** 'contained' (default) or 'overhang' for full-bleed background */
  variant?: Variant;
  /** Vertical padding tokens (default '40' top, '48' bottom) */
  paddingTop?: Padding | "default";
  paddingBottom?: Padding | "default";
  /** Extra classes for the inner grid container */
  className?: string;
  /** Optional overrides */
  style?: CSSProperties & {
    ["--gap"]?: string;
    ["--cols"]?: string;
    ["--pad-x"]?: string;
  };
}>;

export default function GridContainer({
  children,
  backgroundClass,
  variant = "contained",
  paddingTop = "default",
  paddingBottom = "default",
  className = "",
  style,
}: GridContainerProps) {
  const padTop = paddingTop === "default" ? "40" : paddingTop;
  const padBottom = paddingBottom === "default" ? "48" : paddingBottom;

  const paddingClasses = classNames(
    PADS[padTop as Padding],
    PADS[padBottom as Padding],
  );

  // inner content container: centered, capped, and grid-configured
  const inner = classNames(
    "mx-auto max-w-screen-xl", // 1280px cap
    "px-[var(--pad-x,clamp(1rem,5vw,2rem))]", // responsive side padding
    "grid [grid-template-columns:repeat(var(--cols,1),minmax(0,1fr))]",
    "md:[--cols:8] lg:[--cols:12]",
    "[gap:var(--gap,0px)] md:[--gap:32px]",
    "[&>*]:min-w-0",
    paddingClasses,
    className,
  );

  if (variant === "overhang") {
    // full-bleed background layer + capped inner grid
    return (
      <section className="relative">
        <div
          aria-hidden
          className={classNames("absolute inset-0", backgroundClass)}
        />
        <div className="relative">
          {/* lift content above background */}
          <div className={inner} style={style}>
            {children}
          </div>
        </div>
      </section>
    );
  }

  // contained: background stays within capped container
  return (
    <section className={classNames(backgroundClass)}>
      <div className={inner} style={style}>
        {children}
      </div>
    </section>
  );
}
