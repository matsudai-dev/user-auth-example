# API Documentation

## Table of Contents
- [Endpoints](#Endpoints)
    - [`POST /api/v1/signup`](#POST-apiv1signup) : Create a new user account and send a verification email.

## Endpoints

### `POST /api/v1/signup`

```ts
type RequestJSON = {
  email: string;
}

type ResponseText = "OK"
```

1. Returns `400 Bad Request` if the request body is not valid JSON
2. Returns `400 Bad Request` if the email address is invalid
3. Returns `409 Conflict` if the email address is already registered
4. Sends a verification email with an invitation URL ( `/signup/verify?token={signup_session_token}` )
5. Returns `200 OK`
