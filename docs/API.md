# API Documentation

## Table of Contents
- [Endpoints](#Endpoints)
    - [`POST /api/v1/signup`](#POST-apiv1signup) : Create a new user account and send a verification email.
    - [`POST /api/v1/signup/verify`](#POST-apiv1signupverify) : Verify signup session and create user account.
    - [`POST /api/v1/login`](#POST-apiv1login) : Authenticate user and issue JWT.
    - [`POST /api/v1/logout`](#POST-apiv1logout) : Clear authentication cookies and invalidate session.

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

### `POST /api/v1/signup/verify`

```ts
type RequestJSON = {
    signupSessionToken: string;
    password: string;
}

type ResponseText = "OK" | "Bad Request" | "Conflict"
```

#### Password Requirements
- At least 8 characters
- Contains 3 or more types from: lowercase letters, uppercase letters, numbers, symbols
- Not similar to the email address

#### Flow
1. Returns `400 Bad Request` if the request body is not valid JSON
2. Returns `400 Bad Request` if the password does not meet requirements
3. Returns `400 Bad Request` if the signup session token is invalid or expired
4. Returns `409 Conflict` if the email address (from signup_sessions) is already registered in users table
5. Creates a new user in the `users` table with hashed password
6. Issues a JWT and sets it as an HTTP-only cookie
7. Returns `200 OK`

### `POST /api/v1/login`

```ts
type RequestJSON = {
    email: string;
    password: string;
    rememberMe?: boolean; // default: true
}

type ResponseText = "OK" | "Bad Request" | "Not Found" | "Unauthorized" | "Too Many Requests"
```

#### Flow
1. Returns `400 Bad Request` if the request body is not valid JSON or email format is invalid
2. Returns `404 Not Found` if the user does not exist
3. Returns `429 Too Many Requests` if login attempts exceed the threshold
4. Returns `401 Unauthorized` if the password is incorrect (increments failed attempts)
5. Resets failed attempts on successful login
6. Issues access token (15 min) and refresh token as HTTP-only cookies
    - If `rememberMe` is true (default): refresh token has 30-day expiration
    - If `rememberMe` is false: refresh token is a session cookie (deleted when browser closes)
7. Returns `200 OK`

### `POST /api/v1/logout`

```ts
type ResponseText = "OK" | "Unauthorized"
```

#### Flow
1. Returns `401 Unauthorized` if not authenticated
2. Deletes the current login session from `login_sessions` table
3. Clears access token and refresh token cookies
4. Returns `200 OK`
