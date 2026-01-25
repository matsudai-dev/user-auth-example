# Page Documentation

## Table of Contents
- [Pages](#Pages)
    - [`/login`](#login) : User login page
    - [`/signup`](#signup) : User registration page
    - [`/signup/verify`](#signupverify) : Password setup page after email verification

## Pages

### `/login`

User login page for email/password authentication.

#### Components
- Email input field
- Password input field
- Login button

#### Behavior
1. User enters their email address
2. User enters their password
3. User clicks the login button
4. Calls `POST /api/v1/login` with email and password
5. On success (200): Redirects to `/`
6. On error: Displays appropriate error message

### `/signup`

User registration page for creating a new account.

#### Components
- Email input field
- Button to send invitation email

#### Behavior
1. User enters their email address
2. User clicks the send button
3. Calls `POST /api/v1/signup` with the email
4. On success: Displays a confirmation message
5. On error: Displays appropriate error message

### `/signup/verify`

Password setup page accessed via email verification link ( `/signup/verify?token={signup_session_token}` ).

#### Components
- Email address display (read-only)
- Password input field with validation indicators:
    - At least 8 characters
    - Contains 3+ types from: lowercase, uppercase, numbers, symbols
    - Not similar to email address
- Password confirmation input field
    - Must match password field
- Submit button ("登録する")

#### Behavior
1. Token is extracted from URL query parameter
2. Email address is displayed (fetched from signup session)
3. User enters password with real-time validation feedback
4. User confirms password
5. User clicks submit button
6. Calls `POST /api/v1/signup/verify` with token and password
7. On success (200): Redirects to `/`
8. On error: Displays appropriate error message
