# User Auth Example

## Getting Started

```sh
bun install
```

```sh
bun run db:migrate:local
```

```sh
bun run dev
```

Open http://localhost:5173 in your browser.

## Code Quality

```sh
bun run biome && bun run tsc && bun run test:unit
```

```sh
bun run build:e2e && bun run test:e2e
```

## Git

```sh
git fetch; git checkout main; git pull; git checkout -b release/X.Y.Z main
```

```sh
git fetch; git checkout release/X.Y.Z; git pull; git checkout -b feature/#n release/X.Y.Z
```

## Preview

```sh
bun run build:prod && bun run preview
```

Open http://localhost:8787 in your browser.

## Deploy

```sh
wrangler deploy
```
