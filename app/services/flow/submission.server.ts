import { configDotenv } from "dotenv";
import { config } from "../env/env.server";

type SubmitRequest = {
  message: string;
};

/**
 * Note: FIT_CONNECT_ADAPTER_ENDPOINT returning Error: 405 Method not allowed
 */
export async function submit() {
  configDotenv();
  const { FIT_CONNECT_ADAPTER_ENDPOINT } = config();
  const url = `${FIT_CONNECT_ADAPTER_ENDPOINT}/api/sender/submit`;

  const data: SubmitRequest = {
    message: "hello World",
  };

  const params = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const response = await fetch(url, params);

  if (!response.ok) {
    throw new Error(
      `POST request to ${url} failed with status ${response.status}`,
    );
  }

  return response.json();
}
