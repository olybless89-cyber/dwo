FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json tsconfig.json ./

# Copy lib packages (api-client-react depends on them)
COPY lib/ ./lib/
COPY artifacts/tesla-pro/ ./artifacts/tesla-pro/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build the frontend — VITE_API_BASE_URL injected at build time via Railway build args
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV NODE_ENV=production

RUN pnpm --filter @workspace/tesla-pro run build

# ── Serve with nginx ────────────────────────────────────────────────────────
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/artifacts/tesla-pro/dist/public /usr/share/nginx/html

# SPA routing: all paths fall back to index.html
RUN printf 'server {\n\
  listen 8080;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
