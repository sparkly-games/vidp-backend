FROM node:20-slim

# 1. Install system tools
RUN apt-get update && apt-get install -y curl python3 build-essential && rm -rf /var/lib/apt/lists/*

# 2. Setup pnpm and concurrently globally
RUN npm install -g pnpm@latest corepack && corepack enable && npm install -g concurrently

WORKDIR /app

# 3. Copy EVERYTHING first (needed because Cobalt is a monorepo)
# We do this before 'pnpm install' because Cobalt's internal 
# links (@imput/version-info) require the other folders to exist.
COPY . .

# 4. Install dependencies for the root (your Express app)
RUN pnpm install

# 5. Install dependencies for Cobalt's API
# We run this from the root using --filter to let pnpm handle the workspace logic
RUN cd cobalt/api && pnpm install --no-frozen-lockfile

# 6. Expose ports
EXPOSE 3000
EXPOSE 9000

# 7. Start both
CMD ["concurrently", "--kill-others", "cd cobalt/api && pnpm start", "node index.js"]