import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Container } from "~/components";
import { courtForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const postcode = url.searchParams.get("plz");

  if (!postcode) {
    return json({ error: "" });
  }
  if (courtForPlz(postcode) === undefined) {
    return json({ error: "Postleitzahl nicht gefunden" });
  }

  return redirect(`../amtsgericht/${postcode}`);
}

export default function Index() {
  const { error } = useLoaderData<typeof loader>();
  return (
    <Container>
      <Form method="get">
        <input type="text" name="plz" placeholder="Postleitzahl" />
        <button type="submit">Suche</button>
      </Form>
      {error}
    </Container>
  );
}
