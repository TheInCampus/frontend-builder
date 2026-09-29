# API service (planned)

This workspace is reserved for a separately deployed NestJS service. It will host the
BaseModel interpreter, generated CRUD endpoints, workflow execution, authentication
integration, and data connectors such as Google Sheets.

The service is not scaffolded or runnable yet. When backend implementation begins,
initialize it as a NestJS app here and keep its deployment and runtime independent of
`apps/web`. Do not place generated CRUD or data connector logic in Next.js route
handlers.
