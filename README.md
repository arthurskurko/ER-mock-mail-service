# Mock Microsoft Graph Mail Service (A1 + B1)

## Run with Docker
```bash
docker compose down -v
docker compose up --build
```
Open: http://localhost:5173/

## Key scripts
- `npm run cf:dev` → builds then runs `wrangler pages dev .svelte-kit/cloudflare`
- `npm run db:migrate:local` → applies D1 schema locally

## API
`POST /v1.0/me/sendMail`

Success:
- `202 Accepted`
- empty body
- `Location: /mails/:id`

## UI
- `/tester` send requests and see responses
- `/mails` list stored mails
- `/mails/:id` view details
- `/docs` API docs
