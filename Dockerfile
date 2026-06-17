# ── Build Stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies (development dependencies are required to build)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Set environment to production for build optimization
ENV NODE_ENV=production

# Build
RUN npm run build

# ── Serve Stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80
ENV HOSTNAME="0.0.0.0"

# Copy Next.js standalone build which contains only the strictly required files and node_modules subsets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 80

# Command to start the Next.js server using the optimized standalone entry point
CMD ["node", "server.js"]
