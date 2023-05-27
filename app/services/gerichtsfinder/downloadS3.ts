import http from "node:http";
import fs from "node:fs";
import crypto from "node:crypto";

const HOST_URL = "obs.eu-de.otc.t-systems.com";

const signRequest = (
  request: http.ClientRequest,
  fullpath: string,
  access_key_id: string,
  secret_access_key: string
) => {
  const signature = crypto
    .createHmac("sha1", secret_access_key)
    .update(`GET\n\n\n${request.getHeader("Date")}\n/${fullpath}`)
    .digest("base64");
  request.setHeader("Authorization", `AWS ${access_key_id}:${signature}`);
};

export function downloadFromS3(
  bucket_name: string,
  key: string,
  access_key_id: string,
  secret_access_key: string
) {
  // Download authenticated file for OTC OBS and return file path to downloaded file in resolved promise
  return new Promise<string>((resolve, reject) => {
    const options = {
      host: `${bucket_name}.${HOST_URL}`,
      path: `/${key}`,
      method: "GET",
      headers: {
        Host: `${bucket_name}.${HOST_URL}`,
        Date: new Date().toUTCString(),
      },
    };

    const outputFilepath = `${process.cwd()}/${key}`;
    const file = fs.createWriteStream(outputFilepath);

    console.log(`Downloading ${key} from bucket ${bucket_name}...`);

    const req = http.request(options, (res) => {
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve(outputFilepath);
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    signRequest(req, `${bucket_name}/${key}`, access_key_id, secret_access_key);
    req.end();
  });
}
