import axios from "axios";
import { configDotenv } from "dotenv";
import { config } from "../env/env.server";

export async function submit() {
  configDotenv();
  const { FIT_CONNECT_ADAPTER_ENDPOINT } = config();

  return (
    await axios.post(
      `${FIT_CONNECT_ADAPTER_ENDPOINT}/api/sender/submit`,
      {
        message: "hello World",
      },
      { headers: { "Content-Type": "application/json" } },
    )
  ).data;
}
