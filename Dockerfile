FROM node:20-slim

# 1. Install system tools + procps (fixes 'spawn ps' error)
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    build-essential \
    procps \
    git \
    && rm -rf /var/lib/apt/lists/*

# 2. Setup pnpm and concurrently
RUN npm install -g pnpm@latest corepack && corepack enable && npm install -g concurrently

WORKDIR /app

# 3. Copy everything
COPY . .

# 4. FIX: Initialize a fake git repo (fixes 'no git repository root found')
# Cobalt needs to see a .git folder to start up.
RUN git init && \
    git config user.email "you@example.com" && \
    git config user.name "Your Name" && \
    git add . && \
    git commit -m "initial commit"

# 5. Install all dependencies from the root
RUN pnpm install --no-frozen-lockfile

# 6. Expose ports (Koyeb usually uses 10000, Render uses 10000 or 3000)
EXPOSE 3000
EXPOSE 9000

# 7. Start both using workspace filters
# Note: I added --raw to concurrently to make logs cleaner
CMD ["concurrently", "--kill-others", "--raw", "pnpm --filter @imput/cobalt-api start", "node index.js"]