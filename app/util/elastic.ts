import { Client } from "@elastic/elasticsearch";
import { CatIndicesResponse } from "@elastic/elasticsearch/lib/api/types";
import { readFileSync } from "fs";

const certificate = readFileSync("ca.crt");

const client = new Client({
  node: "https://localhost:9200",
  auth: {
    username: process.env.ELASTIC_USERNAME!,
    password: process.env.ELASTIC_PASSWORD!,
  },
  tls: {
    ca: certificate,
    rejectUnauthorized: false,
  },
});

async function getIndices(): Promise<string[]> {
  try {
    const response: CatIndicesResponse = await client.cat.indices({
      format: "json",
    });

    // Extracting the index names from the response
    const indices = response.map((index: any) => index.index);
    return indices;
  } catch (error) {
    console.error("Error retrieving indices:", error);
    throw error;
  }
}

async function getFieldMappings(
  indexName: string
): Promise<{ [fieldName: string]: string }> {
  try {
    const response = await client.indices.getMapping({
      index: indexName,
    });

    const mappings = response[indexName].mappings?.properties || {};

    const fields: { [fieldName: string]: string } = {};

    // Loop through the fields and extract field names and types
    for (const [fieldName, fieldDetails] of Object.entries(mappings)) {
      if (typeof fieldDetails === "object" && "type" in fieldDetails) {
        fields[fieldName] = (fieldDetails as { type: string }).type;
      }
    }

    return fields;
  } catch (error) {
    console.error(`Error fetching mappings for index "${indexName}":`, error);
    throw error;
  }
}

async function getElasticFields() {
  const indices = await getIndices();
  const index = indices.find((index) => index.includes("logstash"));
  if (!index) {
    throw new Error("No logstash index found");
  }

  const fields = await getFieldMappings(index);
  return fields;
}

// Function to execute the Elasticsearch query
async function executeElasticsearchQuery(query: any) {
  try {
    const response = await client.search({
      index: "logstash-2024.10.04",
      body: query,
    });

    return response;
  } catch (error) {
    console.error("Error executing Elasticsearch query:", error);
    throw error;
  }
}

export { getElasticFields, executeElasticsearchQuery };
