# Use a lightweight Node.js base image
FROM node:18-slim

# Install system-level dependencies required for headless Chromium/Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libgconf-2-4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnss3 \
    libxss1 \
    libasound2 \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Set environment variables for Puppeteer
ENV PUPPETEER_CACHE_DIR=/app/.cache/puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

# Copy dependency definitions
COPY package*.json ./

# Install project dependencies
RUN npm install --legacy-peer-deps

# Explicitly install the Chrome browser inside the container's Puppeteer cache
RUN npx puppeteer browsers install chrome

# Copy all source files
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the application port
EXPOSE 10000

# Start both WhatsApp service and Next.js server via prod-start.js
CMD ["npm", "run", "start"]
