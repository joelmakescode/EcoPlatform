# EcoPlatform

Dieses Repository enthält drei Hauptkomponenten:

- **Bot** – Discord-Bot
- **API** – Node.js REST-API für die Bot-Kommunikation
- **C++ App** – Standalone C++ Programm

Alle Komponenten liegen in separaten Unterordnern, aber teilen sich das gleiche Repository.

---

## 🗂️ Repository Struktur

```text
ecoplatform/
├─ bot/          # Discord-Bot
├─ api/          # Node.js API
├─ c++/      # C++ Programm
├─ README.md
├─ .gitignore
└─ docker-compose.yml  (optional)

# Feature-Branch für API
git checkout -b feature/api-new
# Feature-Branch für Bot
git checkout -b feature/bot-new-command
# Feature-Branch für C++ App
git checkout -b feature/cpp-new-feature

# Änderungen hinzufügen
git add .

# Commit mit klarer Nachricht
git commit -m "feat(api): add new endpoint for stock history"

# Push zu origin
git push -u origin feature/api-new

```

## BRUNO 🐶

### HTTP REQUESTS
