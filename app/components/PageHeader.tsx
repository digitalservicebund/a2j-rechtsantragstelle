import LocalLibrary from "@digitalservicebund/icons/LocalLibrary";
import SignLanguage from "@digitalservicebund/icons/SignLanguage";
import { StandaloneLink } from "~/components/StandaloneLink";

type PageHeaderProps = {
  title: string;
  linkLabel: string;
  hideLinks: boolean;
};

export default function Header({
  title,
  linkLabel,
  hideLinks,
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
        {!hideLinks && (
          <div className="flex gap-20 max-sm:pt-16">
            {/* TODO: Add strapi translations */}
            <StandaloneLink
              url={"/leichtesprache"}
              text={"Leichte Sprache"}
              className="flex basis-1/2 ds-label-03-reg items-center"
              icon={<LocalLibrary className="inline mr-10" />}
            />
            {/* TODO: Add strapi translations */}
            <StandaloneLink
              url={"/gebaerdensprache"}
              text={"Gebärdensprache"}
              className="flex basis-1/2 ds-label-03-reg items-center"
              icon={<SignLanguage className="inline mr-10" />}
            />
          </div>
        )}
      </nav>
    </header>
  );
}
