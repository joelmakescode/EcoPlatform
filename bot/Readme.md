# Discord Bot

Der Discord Bot ist eine Ergänzung für den Endnutzer, beinhaltet aber nur limitierte Funktionen.
Um eine möglichst freundliche User Experience zu gewährleisten, soll es bezüglich der Website einen Discord Server geben,
der Support leistet und Interaktionen zwischen verschiedenen Nutzern ermöglicht.

## Workflow des Discord Bots

Zu beachten ist folgednes:
- Der Discord Bot arbeitet mit Komponent, die über die Dependency "Discord.js" zur Verfügung gestellt werden
- Der Bot besitzt nur eine Teilmenge von Funktionen, die die Website implementiert hat

## Aufsetzen des Discord Bots 

Um den Discord vollständig aufzusetzen wird lediglich folgender Befehl ausgeführt:

```text
npm install
```

## Funktionen des Discord Bots

Der Discord Bot soll iterativ folgende Funktionen erhalten:

- Verbindung des Nutzers zwischen Website und Discord
- Anzeigen des Kontostandes auf der Website
- Das zu besitzende Geld kann nicht verwendet werden vom Nutzer in Discord vorerst

Eine vereinfachte User Experience:

- Friendlist: Über die Friendlist kann ein Nutzer einstellen, ob er eine Benachrichtigung bekommen möchte, wenn ein Freund einem
  Voice Chat beitritt
