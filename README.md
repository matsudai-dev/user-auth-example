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
bun run build && bun run test:e2e
```

## Preview

```sh
bun run preview
```

Open http://localhost:8787 in your browser.

## Deploy

```sh
bun run build:prod && wrangler deploy
```
