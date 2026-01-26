export const OK = "OK";
export const BAD_REQUEST = "Bad Request";
export const UNAUTHORIZED = "Unauthorized";
export const NOT_FOUND = "Not Found";
export const CONFLICT = "Conflict";
export const TOO_MANY_REQUESTS = "Too Many Requests";
export const INTERNAL_SERVER_ERROR = "Internal Server Error";

export const SIGNUP_SESSION_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export const ACCESS_TOKEN_COOKIE_NAME = "access_token";
export const ACCESS_TOKEN_EXPIRATION_MS = 15 * 60 * 1000; // 15 minutes

export const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
export const REFRESH_TOKEN_EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const PASSWORD_MIN_LENGTH = 8;

export const LOGIN_MAX_ATTEMPTS = 5;
export const LOGIN_LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
export const LOGIN_RATE_LIMIT_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour
