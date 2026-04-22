# bot/Dockerfile
FROM node:20-bullseye

WORKDIR /app

# package.json + package-lock.json kopieren
COPY package*.json ./

# Dependencies im Container bauen (native Module korrekt für Linux)
RUN npm ci --build-from-source

# Rest des Codes kopieren
COPY bot .

CMD ["node", "index.js"]