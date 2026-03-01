FROM node:20-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt-get update && apt-get install -y curl python3 build-essential && rm -rf /var/lib/apt/lists/* pnpm
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x run.sh
EXPOSE 3000
CMD ./run.sh