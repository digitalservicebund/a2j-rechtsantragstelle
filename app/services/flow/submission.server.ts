import { configDotenv } from "dotenv";
import { config } from "../env/env.server";

type SubmitRequest = {
  message: string;
};

export async function submit() {
  configDotenv();
  const { FIT_CONNECT_ADAPTER_ENDPOINT } = config();
  const url = `${FIT_CONNECT_ADAPTER_ENDPOINT}/api/sender/submit`;

  const data: SubmitRequest = {
    message: "hello World",
  };

  const headers = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const response = await fetch(url, headers);

  if (!response.ok) {
    throw new Error(
      `POST request to ${url} failed with status ${response.status}`,
    );
  }

  return await response.json();
}
