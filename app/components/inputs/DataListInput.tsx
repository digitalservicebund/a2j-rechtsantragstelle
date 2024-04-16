import airports from "data/airports/data.json";
import type { InputProps } from "./Input";

type Props = Readonly<{
  inputName: string;
}> &
  Pick<InputProps, "dataList">;

interface DataListOptions {
  value: string;
  description: string;
}

function getDataListOptions(dataListType?: string): DataListOptions[] {
  if (dataListType === "airports") {
    return airports.map((airport) => ({
      value: airport.iata,
      description: airport.airport.includes(airport.city)
        ? `${airport.airport} (${airport.iata})`
        : `${airport.city} ${airport.airport} (${airport.iata})`,
    }));
  }
  return [];
}

const DataListInput = ({ inputName, dataList }: Props) => {
  const dataListOptions = getDataListOptions(dataList);

  if (dataListOptions.length === 0) {
    return null;
  }

  return (
    <datalist id={`data-list-${inputName}`}>
      {dataListOptions.map(({ value, description }) => (
        <option key={value} value={value}>
          {description}
        </option>
      ))}
    </datalist>
  );
};

export default DataListInput;
