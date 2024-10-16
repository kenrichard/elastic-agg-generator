import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getElasticFields } from "~/util/elastic";

export const loader: LoaderFunction = async () => {
  try {
    const data = await getElasticFields();
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("Error in loader:", error);
    // Handle errors by returning a meaningful response
    throw new Response("Error loading data", { status: 500 });
  }
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>TEST</h1>
      <pre>{JSON.stringify({ data }, null, 2)}</pre>
    </div>
  );
}
