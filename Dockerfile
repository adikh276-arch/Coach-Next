# ── Build Stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Disable Next.js telemetry and set production env
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build
RUN npm run build

# ── Serve Stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy package files and lockfile
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production --legacy-peer-deps

# Copy built public files and compiled standalone app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

# Command to start the Next.js server
CMD ["npm", "run", "start"]
