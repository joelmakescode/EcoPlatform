# EcoPlatform

Dieses Repository enthält drei Hauptkomponenten:

- **Bot** – Discord-Bot/Node.js Discord.js
- **API** – GoLang Backend
- **Frontend** - HTML Website

Alle Komponenten liegen in separaten Unterordnern, aber teilen sich das gleiche Repository.

---

## 🗂️ Repository Struktur

```text
ecoplatform/
├─ bot/          # Discord-Bot
├─ backend/      # API - GoLang
├─ frontend/     # HTML Website
├─ README.md
├─ .gitignore
└─ docker-compose.yml  

# Commit mit klarer Nachricht
git commit -m "feat(api): add new endpoint for stock history"

```

## BRUNO 🐶

### HTTP REQUESTS

#### User Requests

```text
POST - http://localhost:8080/api/users
-----
GET - http://localhost:8080/api/users/{id}
GET - http://localhost:8080/api/users/balance/{id}
-----
PUT - http://localhost:8080/api/users/balance/{id}
```

#### Login (API)
```text
POST - http://localhost:8080/api/login
```

#### Login (Discord)
```text
POST - http://localhost:8080/api/discord-users/login
```

#### Discord User Requests
```text
POST - http://localhost:8080/api/discord-users
```