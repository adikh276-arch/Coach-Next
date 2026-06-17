# ── Build Stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build
RUN npm run build

# ── Serve Stage ───────────────────────────────────────────────────────────────
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Create subpath directory
RUN mkdir -p /usr/share/nginx/html/coach

# Copy the built output into the /coach/ subdirectory
COPY --from=builder /app/out /usr/share/nginx/html/coach

# Install nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY vite-nginx.conf /etc/nginx/conf.d/nginx.conf

# Install generator script for env config
COPY generate-env-config.sh /usr/local/bin/generate-env-config.sh
RUN chmod +x /usr/local/bin/generate-env-config.sh

# Ensure permissions
RUN chmod -R 755 /usr/share/nginx/html/coach

EXPOSE 80

# Run the generator script then start Nginx
CMD ["/bin/sh", "-c", "/usr/local/bin/generate-env-config.sh && nginx -g 'daemon off;'"]
