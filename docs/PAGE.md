# Page Documentation

## Table of Contents
- [Pages](#Pages)
    - [`/signup`](#signup) : User registration page

## Pages

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
