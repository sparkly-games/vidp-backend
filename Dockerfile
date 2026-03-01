FROM node:20-slim

# 1. Install system tools
RUN apt-get update && apt-get install -y curl python3 build-essential && rm -rf /var/lib/apt/lists/*

# 2. Setup pnpm and concurrently globally
RUN npm install -g pnpm corepack concurrently && corepack enable

WORKDIR /app

# 3. Copy files
COPY package.json pnpm-lock.yaml* ./
# If cobalt has its own package.json, copy that too
COPY cobalt/api/package.json ./cobalt/api/

# 4. Install dependencies for both (Express and Cobalt)
RUN pnpm install
RUN cd cobalt/api && pnpm install

COPY . .

# 5. Make sure your ports are ready
EXPOSE 3000
EXPOSE 9000

# 6. THE COMMAND
# We use the globally installed 'concurrently' instead of 'npx'
# We use --kill-others to make sure if one crashes, the whole container restarts
CMD ["concurrently", "--kill-others", "cd cobalt/api && pnpm start", "node index.js"]