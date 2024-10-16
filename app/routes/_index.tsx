import { ActionFunction, json } from "@remix-run/node";
import {
  MetaFunction,
  useActionData,
  Form,
  useNavigation,
} from "@remix-run/react";
import { executeElasticsearchQuery } from "~/util/elastic";
import { generateElasticAggregation } from "~/util/openai";

import { generateElasticAggregationPrompt } from "~/util/prompt";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type ActionData = {
  agg?: string;
  resp?: any; // Adjust the type of resp as needed
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const agg = formData.get("agg");

  // Validate form data
  if (typeof agg !== "string" || agg.trim() === "") {
    return json({ resp: "Invalid or empty input" }, { status: 400 });
  }

  console.log("=== INPUT ==");
  console.log(agg);
  const prompt = generateElasticAggregationPrompt(agg);
  console.log("=== PROMPT ==");
  console.log(prompt);
  const query = await generateElasticAggregation(prompt);
  console.log("=== QUERY ==");
  console.log(JSON.stringify(query, null, 2));
  const resp = await executeElasticsearchQuery(query);
  console.log("=== RESPONSE ==");
  console.log(JSON.stringify(resp, null, 2));

  return json({ resp });
};

export default function Index() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6">Submit Your Aggregated Text</h1>

      <Form method="post" className="w-full max-w-md space-y-4">
        <textarea
          name="agg"
          rows={6}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Enter your text here..."
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </Form>

      {actionData && (
        <div>
          <pre>{JSON.stringify(actionData?.resp, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
