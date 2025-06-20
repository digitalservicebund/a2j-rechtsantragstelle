import { useSearchParams } from "react-router";
// useSearchParams() returns [searchParams, setSearchParams], we only want to check the collection
export const useShouldPrint = () => useSearchParams()[0].has("print");
