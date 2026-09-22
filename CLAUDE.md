# Claude Project Instructions

## Project

This is a Vue 3 + Vite + Vuetify frontend using TypeScript and npm.

Run the app with:

```bash
npm install
npm run dev
```

Validate changes with:

```bash
npm run type-check
npm run build
```

## Feature Location

The client-status management UI is in:

- `src/components/Clients/ClientStatusManager.vue`
- `src/services/clientStatusApi.ts`
- `src/constant.js`
- `src/App.vue`

Use the existing `components/Clients` folder for related Vue components.
Use the API service module for all client-status HTTP requests. Do not put Axios calls directly in Vue templates or components unless the existing service pattern is deliberately changed.

## API

The Laravel API base URL is stored in `src/constant.js` as `constant.API_URL`:

```text
http://127.0.0.1:8001/api
```

No authentication or Authorization header is required.

Allowed endpoints:

- `GET /client-status` - fetch category definitions
- `GET /client-status/items?page=1&per_page=15` - fetch paginated items
- `GET /client-status/items/{itemId}` - fetch one item with categories
- `POST /client-status/items` - create an item
- `PATCH /client-status/items/{itemId}` - update an item

Create and update payload:

```json
{
  "name": "Cash Buyer",
  "category_ids": [1, 2]
}
```

`category_ids` replaces all category assignments during update. An item may belong to multiple categories.

The item list response is paginated. Preserve these response fields when extending the service:

```text
current_page, data, per_page, total, last_page, next_page_url, prev_page_url, links
```

The `data` items include a `categories` array. Use that array to determine which category checkbox columns are checked.

There is currently no delete endpoint in the API contract. Do not invent one or issue a DELETE request. Keep delete UI disabled or remove it until a backend endpoint is provided.

## Implementation Rules

- Follow the existing Vue and Vuetify patterns.
- Keep API contracts represented by TypeScript interfaces.
- Show loading and actionable error states for API operations.
- Refresh the paginated list after create or update.
- Do not add authentication headers.
- Do not replace the shared API constant with a hard-coded URL.
- Keep changes focused and avoid unrelated refactors.