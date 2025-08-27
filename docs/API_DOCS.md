API Documentation (MVP)

Overview

This document specifies the MVP REST API for the Dell–Tsofen NL→SQL / Natural-Language Data Exploration service. It follows the BRD (v1.1) and covers health, NL→Query generation, safe execution, history, and export.

General

- Base URL: http://localhost:3000
- Auth: None (MVP). All operations are read-only. Do not send PII.
- Content-Type: application/json unless noted.
- Errors: JSON with fields { code, message, details? }.

Conventions

- schemaId identifies the active schema/metadata set.
- engine is one of [sqlite, mongo].
- All requests are validated against loaded schema metadata.

GET /health

Description

Service liveness and basic readiness.

Response 200

{
  "status": "ok",
  "uptimeSec": 123.45,
  "version": "0.1.0"
}

POST /nl/sql

Description

Generate SQL (SELECT/WITH) from a natural-language prompt.

Request Body

{
  "prompt": "top 5 customers this year",
  "schemaId": "default"
}

Response 200

{
  "sql": "WITH ... SELECT ...",
  "explanation": "Computes yearly totals and returns top 5 by sum(total)."
}

Errors

- 400 INVALID_PROMPT
- 422 CANNOT_CONVERT

POST /nl/mongo

Description

Generate a MongoDB aggregation pipeline from a natural-language prompt.

Request Body

{
  "prompt": "top 5 customers this year",
  "schemaId": "default"
}

Response 200

{
  "pipeline": [
    { "$match": { "date": { "$gte": "2025-01-01" } } },
    { "$group": { "_id": "$customer_id", "total": { "$sum": "$total" } } },
    { "$sort": { "total": -1 } },
    { "$limit": 5 }
  ],
  "explanation": "Filters orders by year, groups by customer, sorts by total, limits to 5."
}

Errors

- 400 INVALID_PROMPT
- 422 CANNOT_CONVERT

POST /sql/run

Description

Safely execute a read-only SQL statement.

Request Body

{
  "sql": "SELECT name, city FROM customers",
  "engine": "sqlite",
  "connectionId": "local-db-1"
}

Response 200

{
  "headers": ["name", "city"],
  "rows": [["Alice", "Haifa"], ["Bob", "Tel Aviv"]],
  "rowCount": 2
}

Errors

- 400 INVALID_SQL
- 403 UNSAFE_OPERATION (non-SELECT/WITH)
- 422 SCHEMA_VALIDATION_FAILED

POST /mongo/run

Description

Safely execute a MongoDB aggregation pipeline.

Request Body

{
  "pipeline": [ { "$match": { "city": "Haifa" } } ],
  "connectionId": "local-mongo-1"
}

Response 200

{
  "documents": [
    { "name": "Alice", "city": "Haifa" }
  ],
  "count": 1
}

Errors

- 400 INVALID_PIPELINE
- 403 UNSAFE_OPERATION ($out/$merge)
- 422 SCHEMA_VALIDATION_FAILED

GET /history

Description

Return recent prompts and executed statements (redacted—no raw results persisted in logs).

Response 200

{
  "items": [
    { "type": "prompt", "engine": "sqlite", "text": "top 5 customers this year", "ts": "2025-08-27T10:00:00Z" },
    { "type": "sql", "text": "SELECT name, city FROM customers", "ts": "2025-08-27T10:01:12Z" }
  ]
}

GET /export?format=csv|json

Description

Export the last result set in the requested format.

Response 200

- CSV: text/csv stream
- JSON: application/json stream

Response 404

{
  "code": "NO_LAST_RESULT",
  "message": "No result available to export."
}

Error Model

{
  "code": "INVALID_SQL",
  "message": "Only SELECT/WITH are permitted.",
  "details": { "position": 12 }
}

Rate Limits and Quotas (MVP)

- None enforced in MVP beyond basic input size limits.

Security Notes

- Read-only enforcement for SQL and MongoDB; block unsafe constructs.
- API keys and credentials must be provided via environment variables; never commit secrets.
- Do not send raw data rows to LLM providers.

Change Log

- v0.1 (2025-08-27): Initial draft aligned to BRD v1.1.

