# 1. Basis-Image
FROM node:20-alpine

# 2. Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# 3. Package-Dateien kopieren
COPY package*.json ./

# 4. Abhängigkeiten installieren
RUN npm install --production

# 5. Rest des Codes kopieren
COPY . .

# 6. Port freigeben (muss zu docker-compose.yml passen)
EXPOSE 3000

# 7. Startbefehl
CMD ["node", "src/server.js"]