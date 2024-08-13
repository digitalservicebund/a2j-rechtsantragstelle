import LocalLibrary from "@digitalservicebund/icons/LocalLibrary";
import SignLanguage from "@digitalservicebund/icons/SignLanguage";
import { StandaloneLink } from "~/components/StandaloneLink";

type PageHeaderProps = {
  title: string;
  linkLabel: string;
  /**
   * Boolean flag whether or not to hide header links, z.B. if we're
   * in a flow, don't display
   */
  hideHeaderLinks?: boolean;
};

export default function Header({
  title,
  linkLabel,
  hideHeaderLinks,
}: PageHeaderProps) {
  return (
    <header>
      <nav
        className="py-20 px-16 flex flex-wrap justify-between"
        aria-label="Haupt"
      >
        <a
          href="/"
          className="ds-label-01-bold no-underline hover:underline mr-8 text-black focus:outline active:underline active:decoration-4 leading-normal"
          aria-label={linkLabel}
        >
          {title}
        </a>
        {!hideHeaderLinks && (
          <div className="flex gap-20 max-sm:pt-16">
            <StandaloneLink
              url={"/leichtesprache"}
              text={"Leichte Sprache"}
              className="flex basis-1/2"
              icon={<LocalLibrary className="inline mr-10" />}
            />
            <StandaloneLink
              url={"/gebaerdensprache"}
              text={"Gebärdensprache"}
              className="flex basis-1/2"
              icon={<SignLanguage className="inline mr-10" />}
            />
          </div>
        )}
      </nav>
    </header>
  );
}
