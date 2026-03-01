FROM node:20-slim
RUN apt-get update && apt-get install -y curl python3 build-essential && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x run.sh
EXPOSE 3000
CMD ./run.sh