const indexName = "logstash-2024.10.04";

// Define the field mappings as constants
const FIELD_MAPPINGS = {
  air_quality_Carbon_Monoxide: "float",
  air_quality_Nitrogen_dioxide: "float",
  air_quality_Ozone: "float",
  air_quality_PM10: "float",
  air_quality_Sulphur_dioxide: "float",
  "air_quality_gb-defra-index": "float",
  "air_quality_us-epa-index": "float",
  cloud: "float",
  condition_text: "text",
  "country.keyword": "text",
  feels_like_celsius: "float",
  feels_like_fahrenheit: "float",
  gust_kph: "float",
  gust_mph: "float",
  humidity: "float",
  last_updated: "text",
  last_updated_date: "date",
  last_updated_epoch: "float",
  latitude: "float",
  "location_name.keyword": "text",
  longitude: "float",
  message: "text",
  moon_illumination: "text",
  "moon_phase.keyword": "text",
  moonrise: "text",
  moonset: "text",
  precip_in: "float",
  precip_mm: "float",
  pressure_in: "float",
  pressure_mb: "float",
  sunrise: "text",
  sunset: "text",
  temperature_celsius: "float",
  temperature_fahrenheit: "float",
  timezone: "text",
  uv_index: "float",
  visibility_km: "float",
  visibility_miles: "float",
  wind_degree: "text",
  wind_direction: "text",
  wind_kph: "float",
  wind_mph: "float",
};

// Function to generate the Elasticsearch aggregation query prompt
function generateElasticAggregationPrompt(text: string): string {
  return `
For the Elasticsearch index "${indexName}", write an aggregation query to find "${text}". USe the date range of "the past 5 years" if a date range was not provided. The field mappings for the index are as follows:

${Object.keys(FIELD_MAPPINGS)
  .map(
    (field) =>
      `"${field}": "${FIELD_MAPPINGS[field as keyof typeof FIELD_MAPPINGS]}"`
  )
  .join(",\n")}
`;
}

export { generateElasticAggregationPrompt };
