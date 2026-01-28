# AGENTS.md

## About this file
This file provides instructions and context for AI agents.
Please reference this before starting any work on this project.

## Project overview
This is a user authentication sample application.

### Tech stack
- **Development Environment**: Docker container
- **Runtime**: Bun (for development)
- **Deployment**: Cloudflare Workers
- **Framework**: HonoX (Hono + Vite)
- **Database**: Cloudflare D1 with Drizzle ORM
- **Styling**: Tailwind CSS v4
- **Email**: Resend (Test: Mailosaur)
- **Validation**: Zod
- **Unit Testing**: Bun test
- **E2E Testing**: Playwright

### Project structure
- `app/` - Main application source code
    - `db/` - Database client and schemas
    - `components/` - Base components
    - `islands/` - Interactive components
    - `middlewares/` - middlewares
    - `routes/` - Page routes and API endpoints
    - `utils/` - Utility functions organized by domain
- `public/` - Static assets
- `e2e/` - E2E Tests

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
- Never use non-null assertions ( `!` ). Use if statements or other type guards to narrow types, even if it adds redundancy

## Working with GitHub
For all GitHub operations (creating issues, pull requests, searching code, etc.), use `gh` command.

### General guidelines
- Do not add comments to GitHub issues unless explicitly instructed
- Do not edit existing issues unless explicitly instructed

### Creating issues
- Use clear, descriptive titles starting with a verb (e.g., "Add", "Fix", "Update")
- Structure the description with:
    - **Context**: Background and motivation
    - **Requirements**: Specific implementation details
    - **Acceptance Criteria**: Testable outcomes
- Reference existing code patterns when relevant
- Apply appropriate labels: `bug`, `enhancement`, `documentation`, `question`, etc.

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

### Pull requests
- Title format: `prefix: description (#issue_number)`
    - Example: `feat: add rememberMe checkbox to signup verify page (#27)`
- Body structure:
    ```
    ## Summary
    - Bullet points describing the changes

    ## Test plan
    - [x] Completed verification items
    - [ ] Pending items (if any)

    Closes #n
    ```
- Always reference the related issue with `Closes #n`
- Mark test plan items as completed `[x]` after verification

## Development workflows

### Plan A
When the repository administrator ends a coding request with "プランAで対応して", follow this workflow:

1. Create an issue for the task
2. Fetch, checkout `release/X.Y.Z`, pull, then create and checkout `feature/#n` from `release/X.Y.Z`
3. Implement by referencing existing code patterns
4. Create unit tests for pure functions
5. Update E2E tests if new happy paths are added
6. Run verification command: `docker exec user-auth-app bash -c "bun run biome && bun run tsc && bun run test:unit"`
7. If verification succeeds, or after 3 attempts without resolution, request review from the repository administrator
8. Address feedback from the repository administrator
9. When the administrator requests a PR, commit, push, and create a pull request
