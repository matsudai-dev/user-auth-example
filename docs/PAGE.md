# Page Documentation

## Table of Contents
- [Pages](#Pages)
    - [`/`](#root) : Home page
    - [`/login`](#login) : User login page
    - [`/signup`](#signup) : User registration page
    - [`/signup/verify`](#signupverify) : Password setup page after email verification
    - [`/settings`](#settings) : User settings page (requires login)
    - [`/password-reset`](#password-reset) : Password reset request page
    - [`/password-reset/verify`](#password-resetverify) : New password setup page

## Pages

### `/`

Home page with different content based on authentication status.

#### Middleware
- `optionalAuth` - Continues regardless of auth status

#### Components (Authenticated)
- User's email address display
- Link to settings page (`/settings`)

#### Components (Not Authenticated)
- Link to login page (`/login`)

#### Behavior
1. `optionalAuth` middleware checks authentication
2. If authenticated: Displays user's email address and settings link
3. If not authenticated: Displays login link

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

### `/settings`

User settings page for managing account.

#### Middleware
- `createAuthenticatedRoute` - Redirects to `/login?redirect=%2Fsettings` if not authenticated

#### Components
- User's email address display
- Password change form:
    - Current password input field
    - New password input field with validation indicators:
        - At least 8 characters
        - Contains 3+ types from: lowercase, uppercase, numbers, symbols
        - Not similar to email address
    - New password confirmation input field
        - Must match new password field
    - Submit button ("変更する")
- Logout button

#### Behavior
1. `createAuthenticatedRoute` middleware validates authentication
2. If validation fails: Redirects to `/login?redirect=%2Fsettings`
3. If validation succeeds: Displays user's email address, password change form, and logout button

Password change:
1. User enters current password
2. User enters new password with real-time validation feedback
3. User confirms new password
4. User clicks submit button
5. Calls `POST /api/v1/password-change` with current and new password
6. On success (200): Displays success message and clears form
7. On error: Displays appropriate error message

Logout:
1. User clicks logout button
2. Calls `POST /api/v1/logout`
3. On success (200): Redirects to `/`

### `/password-reset`

Password reset request page for users who forgot their password.

#### Components
- Email input field
- Button to send reset email
- Link to login page

#### Behavior
1. User enters their email address
2. User clicks the send button
3. Calls `POST /api/v1/password-reset` with the email
4. On success: Displays a confirmation message
5. On error: Displays appropriate error message

### `/password-reset/verify`

New password setup page accessed via password reset email link ( `/password-reset/verify?token={password_reset_session_token}` ).

#### Components
- Email address display (read-only)
- Password input field with validation indicators:
    - At least 8 characters
    - Contains 3+ types from: lowercase, uppercase, numbers, symbols
    - Not similar to email address
- Password confirmation input field
    - Must match password field
- Submit button

#### Behavior
1. Token is extracted from URL query parameter
2. If token is invalid or expired: Displays error message
3. Email address is displayed (fetched from reset session)
4. User enters password with real-time validation feedback
5. User confirms password
6. User clicks submit button
7. Calls `POST /api/v1/password-reset/verify` with token and password
8. On success (200): Redirects to `/login`
9. On error: Displays appropriate error message
