import { useEffect, useState } from "react";
import { z } from "zod";

const AIRLINE_DETAILS_PATH = "/api/airline/";

export type AirlineDetails = {
  name: string;
};

const AirlineDetailsSchema = z.object({
  name: z.string(),
});

const useAirlineDetails = (airlineByIataCode: string) => {
  const [airlineDetails, setAirlineDetails] = useState<AirlineDetails>({
    name: "",
  });

  useEffect(() => {
    const fetchAirlineDetails = async () => {
      try {
        const response = await fetch(
          `${AIRLINE_DETAILS_PATH}${airlineByIataCode}`,
        );

        if (response.ok) {
          const data = await response.json();
          const { name } = AirlineDetailsSchema.parse(data);
          setAirlineDetails({ name });
        }
      } catch {
        setAirlineDetails({ name: "" });
      }
    };

    void fetchAirlineDetails();
  }, [airlineByIataCode]);

  return airlineDetails;
};

export default useAirlineDetails;
