<div align="center">
  <img src="../public/logo-mys3client96.png" alt="MyS3 Client Logo" />
</div>

# MyS3 Client

Ein leichter, lokaler Web-Client zur Verwaltung eines Minio (S3-kompatiblen) Buckets. Erstellt mit Node.js und Express.

## Funktionen

-   **Datei- und Ordnerverwaltung**: Vollständige CRUD-Operationen (Erstellen, Lesen, Aktualisieren, Löschen) für Dateien und Ordner.
-   **In-Browser-Editor**: Bearbeiten Sie textbasierte Dateien (`.txt`, `.json`, `.md`, etc.) mit einem integrierten Code-Editor.
-   **Moderne Benutzeroberfläche**: Eine saubere, moderne und responsive Benutzeroberfläche.
-   **Einfache Konfiguration**: Konfigurieren Sie den Client mit einer einfachen `.env`-Datei.
-   **Eigenständig**: Der Express-Server übernimmt sowohl die Backend-API als auch die Bereitstellung der Frontend-Anwendung.

## Anforderungen

-   **Node.js**: Eine Long-Term Support (LTS) Version von Node.js ist erforderlich. Das Projekt wird mit Node.js 20.19.0 und höher getestet. Bitte verwenden Sie eine gerade Versionsnummer von Node.js (z.B. 20, 22, 24). Nicht-LTS-Versionen (z.B. 23) werden nicht unterstützt und führen zu Problemen bei der Installation von Abhängigkeiten.

## Einrichtung und Installation

1.  **Klonen Sie das Repository:**
    ```bash
    git clone https://github.com/ihr-repo/mys3-client.git
    cd mys3-client
    ```

2.  **Konfigurieren Sie Ihre Umgebung:**
    Kopieren Sie die Beispiel-Umgebungsdatei in eine neue `.env`-Datei.
    ```bash
    cp exemple.env .env
    ```
    Öffnen Sie dann `.env` und aktualisieren Sie die Werte entsprechend Ihrer Minio-Serverkonfiguration.

3.  **Installieren Sie die Abhängigkeiten:**
    ```bash
    npm install
    ```

## Verwendung

Sobald die Einrichtung abgeschlossen ist, können Sie den Server starten:
```bash
npm run mys3
```
Standardmäßig ist die Anwendung unter `http://localhost:9002` verfügbar.

Sie können einen anderen Port mit dem Flag `-p` angeben:
```bash
npm run mys3 -- -p 9003
```

Der Server verwendet `nodemon`, sodass er bei Änderungen am Code automatisch neu gestartet wird.
