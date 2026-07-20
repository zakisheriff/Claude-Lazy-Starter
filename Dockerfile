# Playwright's own image ships Chromium and every system dependency it needs,
# matched to this exact Playwright version. That is what lets the container
# drive a real browser on an always on host such as Render.
FROM mcr.microsoft.com/playwright:v1.61.1-jammy

WORKDIR /app
ENV NODE_ENV=production

# Install dependencies first for better layer caching.
COPY package.json package-lock.json ./
RUN npm ci

# Build the app.
COPY . .
RUN npm run build

# Use the real browser driver and run headless on the server.
ENV LAZY_DRIVER=playwright
ENV LAZY_HEADLESS=true
# Render provides PORT; next start honours it.
EXPOSE 3000
CMD ["npm", "run", "start"]
