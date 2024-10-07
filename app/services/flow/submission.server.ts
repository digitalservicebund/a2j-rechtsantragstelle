import axios from "axios";
import { configDotenv } from "dotenv";
import { config } from "../env/env.server";

type SubmitRequest = {
  message: string;
};

export async function submit() {
  configDotenv();
  const { FIT_CONNECT_ADAPTER_ENDPOINT } = config();

  const data: SubmitRequest = {
    message: "hello World",
  };

  return (
    await axios.post(
      `${FIT_CONNECT_ADAPTER_ENDPOINT}/api/sender/submit`,
      data,
      { headers: { "Content-Type": "application/json" } },
    )
  ).data;
}
