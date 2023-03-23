import type { DataFunctionArgs } from "@remix-run/node";
import { LoaderFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import config from "~/services/config";

type ImageProps = {
  image: {
    data: {
      attributes?: {
        url: string;
      };
    };
  };
};

const strapiUrl = "todo"; //config().STRAPI_HOST;

const Image = ({ image }: ImageProps) => {
  const strapiUrl = useActionData();
  console.log(strapiUrl);
  if (!image?.data) return null;

  const imageUrl = `${strapiUrl}${image.data?.attributes?.url}`;
  return (
    <>
      <pre className="hidden">
        {JSON.stringify(image.data.attributes, null, 2)}
      </pre>
      {image ? <img src={imageUrl} /> : ""}
    </>
  );
};

export default Image;
