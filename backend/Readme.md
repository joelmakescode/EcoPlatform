# Backend

Das Backend oder auch API übernimmt die Funktionen Anfragen vom Frontend und dem Bot entgegenzunehmen 
und zu verarbeiten.

Die Programmiersprache ist GoLang.

## Workflow
Das Backend arbeitet mit dem Framework Ogen und generiert aus der für Menschen und Maschinen verständlichen openapi.yaml
Code.

Sofern ein neuer Path implementiert werden soll, gelten folgende Regeln:

- ein Path sollte folgenden Aufbau haben: /[Generischer Name]/ 
    
    optional noch: {id} 
- nur GET Methoden dürfen eine ID implementieren, ansonsten kommt diese in den Body

## Ogen Download

Um die API zu aktualisieren, wird folgender Befehl benötigt:

```text
ogen --target api openapi.yaml
```