import { fetchPage } from "~/services/cms/index.server";
import Homepage from "./shared/components/Homepage";

export const loader = async () => {
  const { pageMeta, ...props } = await fetchPage("/");
  return { ...props, meta: pageMeta };
};

export default function Index() {
  return <Homepage />;
}
