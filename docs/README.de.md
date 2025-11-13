
# MyS3-Client

Ein leichter, lokaler Web-Client zur Verwaltung eines Minio (S3-kompatiblen) Buckets. Erstellt mit Node.js, Express und Svelte.

## Funktionen

-   **Datei- und Ordnerverwaltung**: Vollständige CRUD-Operationen (Erstellen, Lesen, Aktualisieren, Löschen) für Dateien und Ordner.
-   **In-Browser-Editor**: Bearbeiten Sie textbasierte Dateien (`.txt`, `.json`, `.md` usw.) mit einem integrierten CodeMirror-Editor.
-   **Moderne Benutzeroberfläche**: Eine saubere, moderne und reaktionsschnelle Benutzeroberfläche, die mit Skeleton UI erstellt wurde.
-   **Einfache Konfiguration**: Konfigurieren Sie den Client mit einer einfachen `.env`-Datei.
-   **Eigenständig**: Der Express-Server übernimmt sowohl die Backend-API als auch die Bereitstellung der Frontend-Anwendung.

## Anforderungen

-   **Node.js**: Eine Long-Term Support (LTS)-Version von Node.js ist erforderlich. Das Projekt wird mit Node.js 20.19.0 und höher getestet. Bitte verwenden Sie eine gerade Versionsnummer von Node.js (z. B. 20, 22, 24). Nicht-LTS-Versionen (z. B. 23) werden nicht unterstützt und führen zu Problemen bei der Installation von Abhängigkeiten.

## Einrichtung und Installation

1.  **Klonen Sie das Repository:**
    ```bash
    git clone https://github.com/Ihr-Repo/mys3-client.git
    cd mys3-client
    ```

2.  **Konfigurieren Sie Ihre Umgebung:**
    Kopieren Sie die Beispiel-Umgebungsdatei in eine neue `.env`-Datei.
    ```bash
    cp exemple.env .env
    ```
    Öffnen Sie dann `.env` und aktualisieren Sie die Werte, damit sie mit Ihrer Minio-Serverkonfiguration übereinstimmen.

3.  **Installieren Sie die Backend-Abhängigkeiten:**
    ```bash
    npm install
    ```

4.  **Installieren Sie die Frontend-Abhängigkeiten:**
    ```bash
    cd frontend
    npm install
    cd ..
    ```

## Verwendung

Nach dem Klonen des Repositorys oder dem Abrufen neuer Änderungen müssen Sie zuerst das Frontend erstellen. Führen Sie den folgenden Befehl im Stammverzeichnis des Projekts aus:
```bash
npm run build
```
Dieser Befehl muss nur einmal nach der Aktualisierung des Codes ausgeführt werden. Er installiert die Frontend-Abhängigkeiten und kompiliert die Svelte-Anwendung.

Sobald der Build abgeschlossen ist, können Sie den Server starten:
```bash
npm run mys3
```
Standardmäßig ist die Anwendung unter `http://localhost:9002` verfügbar.

Sie können einen anderen Port mit dem Flag `-p` angeben:
```bash
npm run mys3 -p 9003
```

Der Server verwendet `nodemon`, sodass er automatisch neu gestartet wird, wenn Sie Änderungen am Backend-Code vornehmen.

## Entwicklung

Für eine bessere Entwicklungserfahrung können Sie den Backend-Server und den Frontend-Entwicklungsserver separat ausführen. Dies ermöglicht das Hot-Reloading der Svelte-Anwendung.

1.  **Starten Sie den Backend-Server:**
    Führen Sie im Stammverzeichnis des Projekts Folgendes aus:
    ```bash
    npm run mys3
    ```

2.  **Starten Sie den Frontend-Entwicklungsserver:**
    Navigieren Sie in einem separaten Terminal zum Verzeichnis `frontend` und führen Sie Folgendes aus:
    ```bash
    cd frontend
    npm run dev
    ```
    Die Svelte-Anwendung ist unter `http://localhost:5173` (oder einem anderen Port, wenn 5173 belegt ist) verfügbar. Der Frontend-Entwicklungsserver leitet API-Anfragen automatisch an den auf Port 9002 laufenden Backend-Server weiter.
