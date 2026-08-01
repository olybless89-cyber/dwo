FROM node:20-alpine AS base
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Dependencies stage
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY lib ./lib
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/tesla-pro/package.json ./artifacts/tesla-pro/
RUN pnpm install --frozen-lockfile

# Build stage
FROM deps AS build
COPY . .
RUN pnpm run build

# Production stage
FROM base AS production
ENV NODE_ENV=production

# Copy only needed files
COPY --from=build /app/artifacts/api-server/dist ./dist
COPY --from=build /app/artifacts/api-server/package.json ./
COPY --from=build /app/artifacts/api-server/build.mjs ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 8080

CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
