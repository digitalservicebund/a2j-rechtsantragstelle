import { useEffect, useState } from "react";
import { z } from "zod";
import type { FluggastrechtContext } from "../formular/context";

const DATA_LIST_API_PATH = "/delay-flight-airports";

type DelayFlightAirportsParameter = {
  verspaeteterFlug: FluggastrechtContext["verspaeteterFlug"];
  startAirport: string;
  endAirport: string;
  ersterZwischenstopp: string;
  zweiterZwischenstopp: string;
  dritterZwischenstopp: string;
};

const getDelayAirports = ({
  verspaeteterFlug,
  startAirport = "",
  endAirport = "",
  ersterZwischenstopp = "",
  zweiterZwischenstopp = "",
  dritterZwischenstopp = "",
}: DelayFlightAirportsParameter) => {
  if (verspaeteterFlug === "startAirportFirstZwischenstopp")
    return {
      startAirport: startAirport,
      endAirport: ersterZwischenstopp,
    };
  if (verspaeteterFlug === "firstZwischenstoppEndAirport")
    return {
      startAirport: ersterZwischenstopp,
      endAirport: endAirport,
    };
  if (verspaeteterFlug === "firstAirportSecondZwischenstopp")
    return {
      startAirport: ersterZwischenstopp,
      endAirport: zweiterZwischenstopp,
    };
  if (verspaeteterFlug === "secondZwischenstoppEndAirport")
    return {
      startAirport: zweiterZwischenstopp,
      endAirport: endAirport,
    };
  if (verspaeteterFlug === "secondAirportThirdZwischenstopp")
    return {
      startAirport: zweiterZwischenstopp,
      endAirport: dritterZwischenstopp,
    };
  if (verspaeteterFlug === "thirdZwischenstoppEndAirport")
    return {
      startAirport: dritterZwischenstopp,
      endAirport: endAirport,
    };

  return {
    startAirport: "",
    endAirport: "",
  };
};

const useDelayFlightAirports = (
  delayFlightAirportsParameter: DelayFlightAirportsParameter,
) => {
  const [delayFlightAirports, setDelayFlightAirports] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { startAirport, endAirport } = getDelayAirports(
          delayFlightAirportsParameter,
        );
        const response = await fetch(
          `${DATA_LIST_API_PATH}?startAirport=${startAirport}&endAirport=${endAirport}`,
        );

        if (response.ok) {
          const delayFlightAirportsResponse = z
            .string()
            .parse(await response.json());
          setDelayFlightAirports(delayFlightAirportsResponse);
        }
      } catch {
        setDelayFlightAirports("");
      }
    };

    void fetchData();
  }, [delayFlightAirportsParameter]);

  return delayFlightAirports;
};

export default useDelayFlightAirports;
