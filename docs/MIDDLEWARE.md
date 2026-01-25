# Middleware Documentation

## Table of Contents
- [Middlewares](#Middlewares)
    - [`login_required`](#login_required) : Authentication middleware for protected routes

## Middlewares

### `login_required`

Authentication middleware that validates JWT access tokens and handles token refresh.

#### Behavior
1. Get access token (JWT) from cookie
2. If JWT is invalid, return 401 Unauthorized
3. If JWT is expired, get refresh token from cookie
4. If refresh token is invalid, return 401 Unauthorized
5. If refresh token is valid:
    - Reissue both access token and refresh token
    - Set new tokens in cookies
    - Update `lastAccessedAt` in `login_sessions` table
6. Pass to next handler with user context
