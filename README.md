
# Project README

## Overview

This project leverages Docker Compose to set up an Elastic stack and a Remix app that allows users to input natural language queries and convert them into Elasticsearch aggregation queries. The stack includes Elasticsearch, Kibana, Logstash, and Metricbeat, providing a robust environment for data aggregation, logging, and metrics collection.

This project is inspired by and built upon the following resources:
- [Getting Started with the Elastic Stack and Docker Compose](https://www.elastic.co/blog/getting-started-with-the-elastic-stack-and-docker-compose)
- [Elastic Stack Docker GitHub Repo by elkninja](https://github.com/elkninja/elastic-stack-docker-part-one)

## Prerequisites

Before running the services, ensure you have the following installed:
- Docker
- Docker Compose

Additionally, you need to configure environment variables in a `.env` file for the Elastic stack services:

- `STACK_VERSION`: The version of the Elastic stack to use.
- `ELASTIC_PASSWORD`: The password for the Elasticsearch superuser.
- `KIBANA_PASSWORD`: The password for the Kibana system user.
- `CLUSTER_NAME`: The Elasticsearch cluster name.
- `ES_PORT`: The port for Elasticsearch.
- `KIBANA_PORT`: The port for Kibana.
- `ES_MEM_LIMIT`: Memory limit for Elasticsearch container.
- `KB_MEM_LIMIT`: Memory limit for Kibana container.
- `LICENSE`: The type of Elasticsearch license (e.g., basic, trial, etc.).
- `ENCRYPTION_KEY`: Encryption key for Kibana.

## Setup Instructions

1. **Clone the Repository**
   Clone this repository to your local machine.

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Configure Environment Variables**
   Create a `.env` file at the root of the project with the required variables:

   ```bash
   STACK_VERSION=7.15.2
   ELASTIC_PASSWORD=changeme
   KIBANA_PASSWORD=changeme
   CLUSTER_NAME=docker-cluster
   ES_PORT=9200
   KIBANA_PORT=5601
   ES_MEM_LIMIT=1g
   KB_MEM_LIMIT=512m
   LICENSE=basic
   ENCRYPTION_KEY=changeme
   ```

3. **Run Docker Compose**
   To set up and run the Elastic stack, execute:

   ```bash
   docker-compose up
   ```

   The `setup` service will generate the necessary certificates and configure the Elastic stack before launching the remaining services (Elasticsearch, Kibana, Logstash, Metricbeat).

4. **Remix App**
   The Remix app is located in the `remix-app/` directory. You can run the app independently using the following steps:

   ```bash
   cd remix-app
   npm install
   npm run dev
   ```

   Make sure the Elasticsearch services are running before starting the Remix app. The Remix app takes natural language inputs and converts them into Elasticsearch aggregation queries.

## Services

### Elasticsearch
- Accessible at `https://localhost:${ES_PORT}`.
- Secured with certificates and requires `ELASTIC_PASSWORD`.

### Kibana
- Accessible at `http://localhost:${KIBANA_PORT}`.
- Kibana can be used to visualize logs, metrics, and Elasticsearch queries.

### Logstash
- Reads data from `logstash_ingest_data/` and processes it according to the `logstash.conf` configuration file.
- Pushes data to Elasticsearch.

### Metricbeat
- Collects and sends Docker and system metrics to Elasticsearch.

## Volumes and Data

The following Docker volumes are used to persist data across container restarts:

- `certs`: Stores SSL certificates for Elasticsearch.
- `esdata01`: Stores Elasticsearch data.
- `kibanadata`: Stores Kibana data.
- `metricbeatdata01`: Stores Metricbeat data.
- `logstashdata01`: Stores Logstash data.

## Networks

A custom network `elastic` is created for inter-service communication within the Docker stack.

## Natural Language to Aggregation Query

The key feature of this project is the Remix app that accepts natural language input from users and generates corresponding Elasticsearch aggregation queries. This can be used for simplifying complex query construction by translating user-friendly inputs into Elasticsearch syntax.

## Troubleshooting

If you encounter issues during setup, ensure:
- Environment variables in the `.env` file are set correctly.
- Docker is running and has enough resources allocated.

Check the logs of any failing services using:

```bash
docker-compose logs <service-name>
```

For example, to view Elasticsearch logs:

```bash
docker-compose logs es01
```

## License

This project is licensed under the MIT License.

---

Feel free to modify the services, configurations, and environment variables as needed for your development environment.
