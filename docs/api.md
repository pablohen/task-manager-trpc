# API

The backend is a tRPC router (`src/server/routers/task.ts`) served at `/api/trpc`. Payloads use the [superjson](https://github.com/flightcontrolhq/superjson) wire format: inputs go in a `json` key, and `createdAt` comes back as an ISO string with a `meta` entry marking it as a `Date`. The tRPC client handles this for you.

## Model

```ts
type Task = {
  id: string;           // UUID, generated
  title: string;        // trimmed, 1–120 characters
  description?: string; // trimmed, up to 1000 characters; "" is stored as no description
  createdAt: Date;
};
```

## Procedures

| Procedure | Type | Input | Returns |
| --- | --- | --- | --- |
| `task.list` | query | `{ limit?: 1–50 (default 10), cursor?: string \| null, search?: string (≤100) }` | `{ items: Task[], nextCursor: string \| null }` |
| `task.byId` | query | `{ id: uuid }` | `Task` |
| `task.create` | mutation | `{ title, description? }` | `Task` |
| `task.update` | mutation | `{ id: uuid, title, description? }` | `Task` |
| `task.delete` | mutation | `{ id: uuid }` | `{ id }` |

`list` returns newest first. Pass the previous page's `nextCursor` to get the next page; `null` means there are no more. `search` matches title or description, case-insensitively; blank means no filter.

## Errors

| Situation | Code | HTTP | `message` |
| --- | --- | --- | --- |
| Invalid input | `BAD_REQUEST` | 400 | first validation message id, e.g. `validation.titleRequired` |
| Unknown task id (`byId`, `update`, `delete`) | `NOT_FOUND` | 404 | `Task not found` |

Validation messages are message ids from the i18n catalogs (see [i18n.md](i18n.md)), so clients can show them in the user's language. Per-field errors are in `data.zodError.fieldErrors`.

## Examples

List, filtered:

```bash
curl -G http://localhost:3000/api/trpc/task.list \
  --data-urlencode 'input={"json":{"limit":10,"search":"report"}}'
```

```json
{"result":{"data":{"json":{"items":[{"id":"894734f7-…","title":"Write the quarterly report","description":"Notes for \"Write the quarterly report\".","createdAt":"2026-11-01T00:04:01.539Z"}],"nextCursor":null},"meta":{"values":{"items.0.createdAt":["Date"]},"v":1}}}}
```

Create:

```bash
curl -X POST http://localhost:3000/api/trpc/task.create \
  -H 'content-type: application/json' \
  -d '{"json":{"title":"Buy milk","description":"2 liters"}}'
```

Validation error:

```json
{"error":{"json":{"message":"validation.titleRequired","code":-32600,"data":{"code":"BAD_REQUEST","httpStatus":400,"path":"task.create","zodError":{"formErrors":[],"fieldErrors":{"title":["validation.titleRequired"]}}}}}}
```

Missing task:

```json
{"error":{"json":{"message":"Task not found","code":-32004,"data":{"code":"NOT_FOUND","httpStatus":404,"path":"task.update","zodError":null}}}}
```
