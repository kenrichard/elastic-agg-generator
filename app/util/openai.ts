import axios from "axios";
import { j } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_MODEL = "gpt-4";

// Define the type for the expected format of an Elasticsearch aggregation
interface ElasticAggregation {
  [key: string]: {
    terms?: {
      field: string;
      size?: number;
    };
    range?: {
      field: string;
      ranges: { from?: number; to?: number }[];
    };
    avg?: { field: string };
  };
}

// Type for the OpenAI API response
interface ChatGPTResponse {
  choices: { message: { content: string } }[];
}

function extractJsonContent1(text: string): string | null {
  // Regular expression to match content between ```json and ```
  const jsonContentMatch = text.match(/```json([\s\S]*?)```/);

  if (jsonContentMatch && jsonContentMatch.length > 1) {
    // Return the extracted JSON content, trimming any leading/trailing whitespace
    return jsonContentMatch[1].trim();
  }

  // Return null if no valid JSON content is found
  return null;
}

function extractJsonContent2(text: string): string | null {
  // Regular expression to match content between ```json and ```
  const jsonContentMatch = text.match(/```([\s\S]*?)```/);

  if (jsonContentMatch && jsonContentMatch.length > 1) {
    // Return the extracted JSON content, trimming any leading/trailing whitespace
    return jsonContentMatch[1].trim();
  }

  // Return null if no valid JSON content is found
  return null;
}

// Function to generate Elasticsearch aggregation from a prompt
export async function generateElasticAggregation(
  prompt: string
): Promise<ElasticAggregation | null> {
  try {
    // Make API request to ChatGPT
    const response = await axios.post<ChatGPTResponse>(
      OPENAI_API_URL,
      {
        model: OPENAI_API_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that formats Elasticsearch aggregation queries as JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const data = response.data;
    const rawContent = data.choices[0].message.content.trim();
    console.log("Raw content:", rawContent);
    const jsonContent =
      extractJsonContent1(rawContent) ?? extractJsonContent2(rawContent);
    if (!jsonContent) {
      throw new Error("Error extracting json content");
    }

    // Parse the response from the model into a JSON object
    const aggregation: ElasticAggregation = JSON.parse(jsonContent);

    return aggregation;
  } catch (error) {
    console.error("Error generating Elasticsearch aggregation:", error);
    return null;
  }
}
