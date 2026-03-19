# ---- Base Image ----
FROM node:18-alpine

# ---- App Directory ----
WORKDIR /app

# ---- Dependencies installieren (nur package.json zuerst kopieren) ----
COPY package*.json ./

RUN npm install --production

# ---- Restlichen Code kopieren ----
COPY . .

# ---- Port exposen ----
EXPOSE 3000

# ---- Startcommand ----
CMD ["npm", "start"]