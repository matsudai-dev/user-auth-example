# AGENTS.md

## About this file
This file provides instructions and context for AI agents.
Please reference this before starting any work on this project.

## Project overview
This is a user authentication sample application.

### Tech stack
- **Development Environment**: Docker container
- **Framework**: HonoX (Hono + Vite)
- **Runtime**: Bun (for development and testing)
- **Deployment**: Cloudflare Workers
- **Database**: Cloudflare D1 with Drizzle ORM
- **Styling**: Tailwind CSS v4
- **Email**: Resend (Test: Mailosaur)
- **Validation**: Zod
- **Unit Testing**: Bun test
- **E2E Testing**: Playwright

### Available commands
All commands should be run inside the Docker container. From the host OS, prefix commands with:

`docker exec -it user-auth-app bash -c "..."`

- `bun run biome` - Run Biome linter/formatter
- `bun run tsc` - Run TypeScript type checker
- `bun run test:unit` - Run unit tests
- `bun run test:e2e` - Run E2E tests
- `bun run dev` - Start development server ( `http://localhost:5173` )
- `bun run build` - Build for production
- `bun run preview` - Preview build with Wrangler
- `bun run deploy` - Deploy to Cloudflare Workers

### Project structure
- `app/` - Main application source code
    - `db/` - Database client and schemas
    - `components/` - Base components
    - `islands/` - Interactive components
    - `middleware/` - Request middleware
    - `routes/` - Page routes and API endpoints
    - `utils/` - Utility functions organized by domain
- `public/` - Static assets

## Code style guidelines

### Markdown
- Use 4 spaces for indentation

### TypeScript
- Use tabs for indentation
- Use semicolons
- Use camelCase for variable and function names
- Use PascalCase for type/interface names
- Use early returns to reduce nesting
- Prefer immutability (const over let, avoid mutations)
- Write declarative code over imperative code
- Use generic syntax for array types ( `Array<string>` ) instead of shorthand ( `string[]` )

### Import organization
- Biome automatically sorts imports A-Z, so no need to manually order them
- Write all imports without blank lines between them to ensure proper sorting
- Use `@/` path alias for internal modules

### API routes structure
- Use `createHonoApp()` factory function to create route handlers
- Export route as named export: `export const route = ...`
- Also include default export: `export default route`
- Apply middleware in order: validator, error handler, main handler

### Validation
- Use `@hono/standard-validator` with Zod schemas
- Define validators as separate variables (e.g., `const jsonValidator = sValidator(...)` ) before the route handler
- Return appropriate HTTP status codes in validation error handlers (e.g., 400 for bad requests)

### Constants ( `@/consts` )
- Define status message constants (e.g., `BAD_REQUEST` , `CONFLICT` , `OK` )
- Define duration constants in milliseconds (e.g., `SIGNUP_SESSION_EXPIRATION_MS` )

### Error handling
- Use `c.text(MESSAGE, statusCode)` for responses
- Apply `injectExternalErrors` middleware to handle external service errors
- Common status codes:
    - 200: OK
    - 400: Bad Request
    - 401: Unauthorized
    - 409: Conflict
    - 429: Too Many Requests

### Database operations
- Get database client using `getDBClient(c.env.DB)`
- Use Drizzle ORM query builder
- Use `.get()` for single record queries
- Name table imports with `Table` suffix (e.g., `usersTable` , `signupSessionsTable` )

### Date Utilities ( `@/utils/date` )

- `offsetMilliSeconds(date: Date, ms: number): Date`

### Crypto Utilities ( `@/utils/crypto/server` )

- `generateUuidv7(): string` - Generates a time-ordered UUIDv7 for database primary keys
- `generateSecureToken(bytes?: number): string` - Generates a URL-safe base64 encoded random token
- `hashToken(token: string): string` - Hashes a token using SHA-256 for secure storage

## Testing instructions
1. add the function
2. Write test code for the function
3. Run the test command to confirm all tests pass
- Place `{filename}.spec.ts` in the same directory as `{filename}.ts`
- `"noUncheckedIndexedAccess": true` is configured in TypeScript, so indexed elements may be `undefined` . In test code that doesn't handle `undefined` , throw an error explicitly

## Working with GitHub
For all GitHub operations (creating issues, pull requests, searching code, etc.), use `gh` command.

### Creating issues
- Use clear, descriptive titles starting with a verb (e.g., "Add", "Fix", "Update")
- Structure the description with:
    - **Context**: Background and motivation
    - **Requirements**: Specific implementation details
    - **Acceptance Criteria**: Testable outcomes
- Reference existing code patterns when relevant
- Apply appropriate labels: `bug`, `enhancement`, `documentation`, `question`, etc.

### Working on an issue
1. Create issue using `gh issue create`
2. Create and checkout a new branch named `feature/#n` from the `main` or `release/X.Y.Z` branch (where `#n` is the issue number)
3. Implement the feature
4. Run all checks: `bun run biome && bun run tsc && bun run test:unit && bun run test:e2e`
5. Commit changes with `Closes #n` in the commit message to auto-close the issue on merge
6. Push the branch: `git push -u origin feature/#n`
7. Create a pull request using `gh pr create --base <main or release/X.Y.Z> --head feature/#n`
8. After PR is merged, delete the remote branch

### Release workflow
1. Create a `release/X.Y.Z` branch from `main`
2. Update `version` in `package.json` to `X.Y.Z` and commit
3. Merge feature branches into `release/X.Y.Z`
4. When ready, create a PR to merge `release/X.Y.Z` into `main`
5. After PR is merged into `main`, create a tag and release: `git tag vX.Y.Z && git push origin vX.Y.Z && gh release create vX.Y.Z --title "vX.Y.Z" --notes "..."`

### Commit messages
- Use conventional commit format with lowercase prefixes (e.g., "feat:", "fix:", "chore:")
- Keep messages concise - prefer single-line format to reduce overhead
- Common prefixes:
    - `feat:` - New features
    - `fix:` - Bug fixes
    - `chore:` - Maintenance tasks (dependencies, configuration)
    - `docs:` - Documentation changes
    - `test:` - Test additions or modifications
    - `refactor:` - Code refactoring without changing functionality
