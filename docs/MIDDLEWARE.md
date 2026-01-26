# Middleware Documentation

## Table of Contents
- [Authentication Middleware](#authentication-middleware)
    - [`authMiddleware`](#authmiddleware) - Factory function for custom auth handling
    - [`optionalAuth`](#optionalauth) - Pre-configured middleware for optional authentication
    - [`loginRequired`](#loginrequired) - Pre-configured middleware for API authentication
    - [`createAuthenticatedRoute`](#createauthenticatedroute) - Factory for authenticated page routes

## Authentication Middleware

### `authMiddleware`
1. Get access token (JWT) from cookie
2. If valid, call hook with `{ success: true, user }` and set user in context
3. If invalid/expired, get refresh token from cookie
4. If refresh token is invalid, call hook with `{ success: false }`
5. If refresh token is valid:
    - Reissue both access token and refresh token
    - Set new tokens in cookies
    - Update refresh token hash in `login_sessions` table
    - Call hook with `{ success: true, user }`
6. If hook returns a `Response`, short-circuit and return it
7. Otherwise, set user in context and pass to next handler

### `optionalAuth`
- `authMiddleware<Env>()` pre-configured
- Continues regardless of auth status
- `c.get("user")` returns `User | undefined`

### `loginRequired`
- `authMiddleware<AuthenticatedEnv>()` pre-configured
- Returns 401 on auth failure
- `c.get("user")` returns `User` (guaranteed)

### `createAuthenticatedRoute`
- Wraps `createRoute` with `authMiddleware`
- Automatically redirects to `/login` (with redirect param) on auth failure
- Provides `AuthenticatedEnv` context where `user` is guaranteed to exist
