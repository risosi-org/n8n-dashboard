# Auth API

Simple JWT + cookie authentication. All `/api/*` routes are protected by an access token supplied via `Authorization: Bearer <token>` or the `accessToken` cookie.

## Environment Variables
- `AUTH_USERNAME` / `AUTH_PASSWORD` – credentials checked at login
- `ACCESS_TOKEN_SECRET` – secret for access JWT
- `REFRESH_TOKEN_SECRET` – secret for refresh JWT
- `ACCESS_TOKEN_EXPIRES_IN` – access TTL (default `15m`)
- `REFRESH_TOKEN_EXPIRES_IN` – refresh TTL (default `7d`)
- `NODE_ENV` – if `production`, cookies are set with `secure: true`

## Tokens & Cookies
- Access token: short-lived JWT, sent via header or `accessToken` cookie (httpOnly, sameSite=lax).
- Refresh token: longer-lived JWT, stored in `refreshToken` cookie (httpOnly, sameSite=lax).
- On login/refresh, both cookies are set.

## Routes

### POST `/auth/login`
Authenticate using env credentials; issues tokens and sets cookies.
- Body: `{ "username": "<string>", "password": "<string>" }`
- 200:
  ```json
  { "accessToken": "<jwt>", "refreshToken": "<jwt>" }
  ```
- 401:
  ```json
  { "error": "Invalid credentials" }
  ```

### POST `/auth/refresh`
Exchange a valid refresh token for a new access token.
- Accepts refresh token from body `{ "refreshToken": "<jwt>" }`, `Authorization: Bearer <jwt>`, or `refreshToken` cookie.
- 200:
  ```json
  { "accessToken": "<jwt>", "refreshToken": "<jwt>" }
  ```
- 401:
  ```json
  { "error": "Invalid or expired refresh token" }
  ```
  or
  ```json
  { "error": "Refresh token required" }
  ```

### POST `/auth/logout`
Clears auth cookies.
- 200:
  ```json
  { "message": "Logged out" }
  ```

## Protected Routes
All `/api/*` routes require a valid access token.
- Missing/invalid: `401 { "error": "Unauthorized" }` or `401 { "error": "Invalid or expired token" }`.

## cURL Examples
Login and store cookies:
```
curl -i -c cookies.txt -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"YOUR_USER","password":"YOUR_PASS"}'
```

Refresh with cookie:
```
curl -i -b cookies.txt -c cookies.txt -X POST http://localhost:3001/auth/refresh
```

Call protected route with cookie:
```
curl -i -b cookies.txt http://localhost:3001/api/conversations
```

Call protected route with Authorization header:
```
curl -i -H "Authorization: Bearer <accessToken>" http://localhost:3001/api/conversations
```

Logout:
```
curl -i -b cookies.txt -X POST http://localhost:3001/auth/logout
```
# Auth API

## Environment Variables
- `AUTH_USERNAME` / `AUTH_PASSWORD`: credentials checked at login.
- `ACCESS_TOKEN_SECRET`: JWT secret for access tokens.
- `REFRESH_TOKEN_SECRET`: JWT secret for refresh tokens.
- `ACCESS_TOKEN_EXPIRES_IN` (default `15m`)
- `REFRESH_TOKEN_EXPIRES_IN` (default `7d`)
- `NODE_ENV`: if `production`, auth cookies are `secure`.

## Tokens & Cookies
- Access token: short-lived JWT, sent via `Authorization: Bearer <token>` **or** `accessToken` cookie (HTTP-only).
- Refresh token: longer-lived JWT, stored in `refreshToken` cookie (HTTP-only).
- All `/api/*` routes require a valid access token.

## Routes

### POST `/auth/login`
Authenticate with env creds. On success issues tokens and sets cookies.
- Body: `{ "username": "...", "password": "..." }`
- Success `200`:
  ```json
  { "accessToken": "<jwt>", "refreshToken": "<jwt>" }
  ```
  Cookies: `accessToken` (httpOnly, ~15m), `refreshToken` (httpOnly, ~7d)
- Errors: `401 { "error": "Invalid credentials" }`

### POST `/auth/refresh`
Issue a new access token using a valid refresh token.
- Provide refresh token via:
  - Body: `{ "refreshToken": "<jwt>" }` **or**
  - Header: `Authorization: Bearer <jwt>` **or**
  - Cookie: `refreshToken`
- Success `200`:
  ```json
  { "accessToken": "<jwt>", "refreshToken": "<same-or-new>" }
  ```
  Also resets cookies.
- Errors: `401 { "error": "Invalid or expired refresh token" }` or `401 { "error": "Refresh token required" }`

### POST `/auth/logout`
Clears auth cookies.
- Success `200`: `{ "message": "Logged out" }`

## Protected Routes
All `/api/*` routes require a valid access token.
- Send `Authorization: Bearer <accessToken>` or rely on `accessToken` cookie.
- Unauthorized/expired: `401 { "error": "Invalid or expired token" }` or `401 { "error": "Unauthorized" }`

## Quick cURL Examples

Login (store cookies):
```
curl -i -c cookies.txt -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"YOUR_USER","password":"YOUR_PASS"}'
```

Refresh (using cookie):
```
curl -i -b cookies.txt -c cookies.txt -X POST http://localhost:3001/auth/refresh
```

Call a protected route (with cookie):
```
curl -i -b cookies.txt http://localhost:3001/api/conversations
```

Call a protected route (with Authorization header):
```
curl -i -H "Authorization: Bearer <accessToken>" http://localhost:3001/api/conversations
```

Logout:
```
curl -i -b cookies.txt -X POST http://localhost:3001/auth/logout
```

## Notes
- Set strong secrets in production (`ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`).
- Cookies are `httpOnly`, `sameSite=lax`; set `NODE_ENV=production` to add `secure`.
- Refresh reuses the provided refresh token in responses; rotate if you prefer stricter security.

