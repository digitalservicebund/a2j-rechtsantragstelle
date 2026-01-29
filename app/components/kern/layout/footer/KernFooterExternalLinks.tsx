import { KernIcon } from "../../common/KernIcon";

export const KernFooterExternalLinks = () => {
  return (
    <div>
      <p className="kern-body gap-kern-space-default">
        Ein Pilotprojekt des{" "}
        <a
          href="https://www.bmjv.de/"
          className="kern-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <KernIcon
            name="open-in-new"
            className="w-[1em] h-[1em] flex-shrink-0 mt-4"
          />{" "}
          Bundesministeriums der Justiz und für Verbraucherschutz
        </a>
      </p>
      <p className="kern-body gap-kern-space-default">
        Umsetzung und Betrieb durch{" "}
        <a
          href="https://digitalservice.bund.de/"
          className="kern-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <KernIcon
            name="open-in-new"
            className="w-[1em] h-[1em] flex-shrink-0 mt-4"
          />{" "}
          DigitalService GmbH des Bundes
        </a>
      </p>
    </div>
  );
};
