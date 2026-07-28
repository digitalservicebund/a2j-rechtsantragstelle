import { fetchPage } from "~/services/cms/index.server";
import Homepage from "./shared/components/Homepage";

export const loader = async () => {
  return { pageMeta: { title: "Justiz-Services" } };
};

export default function Index() {
  return <Homepage />;
}
