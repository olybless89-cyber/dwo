FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json tsconfig.json ./

# Copy all lib packages (api-server depends on them)
COPY lib/ ./lib/

# Copy the api-server artifact
COPY artifacts/api-server/ ./artifacts/api-server/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build the api-server
RUN pnpm --filter @workspace/api-server run build

# ── Runtime stage ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

# Only copy the compiled output
COPY --from=builder /app/artifacts/api-server/dist ./dist

# pino-pretty transport is loaded at runtime from node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/artifacts/api-server/node_modules ./artifacts/api-server/node_modules

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "--enable-source-maps", "./dist/index.mjs"]

EXPOSE 8080

CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
