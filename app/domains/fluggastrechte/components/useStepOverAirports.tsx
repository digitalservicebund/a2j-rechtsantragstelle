import { useEffect, useState } from "react";
import { z } from "zod";

const STEP_OVER_AIRPORTS_PATH = "/step-over-airports";

export type StepOverAirports = {
  ersterZwischenstoppName: string;
  zweiterZwischenstoppName: string;
  dritterZwischenstoppName: string;
};

const StepOverAirportsSchema = z.custom<StepOverAirports>();

const useStepOverAirports = (
  ersterZwischenstopp: string,
  zweiterZwischenstopp: string,
  dritterZwischenstopp: string,
) => {
  const [stepOverAirports, setStepOverAirports] = useState<StepOverAirports>({
    ersterZwischenstoppName: "",
    zweiterZwischenstoppName: "",
    dritterZwischenstoppName: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${STEP_OVER_AIRPORTS_PATH}?ersterZwischenstopp=${ersterZwischenstopp}&zweiterZwischenstopp=${zweiterZwischenstopp}&dritterZwischenstopp=${dritterZwischenstopp}`,
        );

        if (response.ok) {
          const stepOverAirportsParse = StepOverAirportsSchema.parse(
            await response.json(),
          );
          setStepOverAirports(stepOverAirportsParse);
        }
      } catch {
        setStepOverAirports({
          ersterZwischenstoppName: "",
          zweiterZwischenstoppName: "",
          dritterZwischenstoppName: "",
        });
      }
    };

    void fetchData();
  }, [ersterZwischenstopp, zweiterZwischenstopp, dritterZwischenstopp]);

  return stepOverAirports;
};

export default useStepOverAirports;
