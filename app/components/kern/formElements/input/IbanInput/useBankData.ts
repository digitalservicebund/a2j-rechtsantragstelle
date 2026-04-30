import { useEffect, useState } from "react";
import { type BankData } from "~/components/kern/formElements/input/IbanInput";

export function useBankData() {
  const [bankData, setBankData] = useState<BankData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/banks/list");

        if (response.ok) {
          const json = await response.json();
          setBankData(json);
        }
      } catch {
        setBankData(undefined);
      }
    };
    fetchData();
  }, []);

  return bankData;
}
