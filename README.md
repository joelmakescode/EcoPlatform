# EcoPlatform

Dieses Repository enthält drei Hauptkomponenten:

- **Bot** – Discord-Bot/Node.js Discord.js
- **Backend** – GoLang Backend
- **Frontend** - HTML Website/TypeScript Angular Framework

Alle Komponenten liegen in separaten Unterordnern, aber teilen sich das gleiche Repository.

---

## 🗂️ Repository Struktur

```text
ecoplatform/
├─ bot/          # Discord-Bot
├─ backend/      # API - GoLang
├─ frontend/     # HTML Website / Angular Framework
├─ README.md
├─ .gitignore
└─ docker-compose.yml  
```

## 🔧 Vorgehensweise im Projekt

Das Projekt basiert auf der iterativen Erstellung von Issues in GitHub.

```text
Bevor ein Default Workflow getriggert wird, muss eine Besprechung
der Wünsche stattgefunden haben.

Default Workflow:

- Es wird ein Issue erstellt. Das Issue soll alle zu erwartenden 
  Anforderungen beschreiben. Eine Anforderung wird als Work-Item
  beschrieben. Ein Issue ist erst beendet, wenn alle Anforderungen
  erfüllt sind.
  
Bug Workflow:

- Sofern ein Bug vorliegt, wird dieser mit einem Issue beschrieben.
  Das Issue soll alle Fehler des Bugs enthalten und eine Lösung zur
  Behebung des Bugs beinhalten. Ein Bug Issue ist erst abgeschlossen,
  wenn die volle Funktionalität der Komponenten wieder hergestellt ist.
```

Ein Issue wird folgendermaßen erstellt:

```text
[BACKEND / BOT / FRONTEND] ISSUE TITLE
```

## Branch Struktur

Branches werden folgendermaßen erstellt:

Default Workflow:

```text
git checkout -b feature/[ISSUE-NUMBER]-[ISSUE-TITLE]
```

Bug Workflow:
```text
git checkout -b hotfix/[ISSUE-NUMBER]-[ISSUE-TITLE]
```

## Reviews
Reviews sind grundsätzlich nicht nötig, werden jedoch erwünscht.
Wichtig zu beachten ist, dass Anforderungen nicht vernachlässigt werden.
