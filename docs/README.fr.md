<div align="center">
  <img src="../public/logo-mys3client96.png" alt="Logo MyS3 Client" />
</div>

# MyS3 Client

Un client web local et léger pour gérer un compartiment Minio (compatible S3). Conçu avec Node.js et Express.

## Fonctionnalités

-   **Gestion des fichiers et des dossiers** : Opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) complètes pour les fichiers et les dossiers.
-   **Éditeur dans le navigateur** : Modifiez des fichiers texte (`.txt`, `.json`, `.md`, etc.) avec un éditeur de code intégré.
-   **Interface utilisateur moderne** : Une interface utilisateur propre, moderne et réactive.
-   **Configuration facile** : Configurez le client avec un simple fichier `.env`.
-   **Autonome** : Le serveur Express gère à la fois l'API backend et sert l'application frontend.

## Prérequis

-   **Node.js** : Une version de support à long terme (LTS) de Node.js est requise. Le projet est testé avec Node.js 20.19.0 et supérieur. Veuillez utiliser une version paire de Node.js (par exemple, 20, 22, 24). Les versions non-LTS (par exemple, 23) ne sont pas prises en charge et entraîneront des problèmes d'installation des dépendances.

## Configuration et installation

1.  **Clonez le dépôt :**
    ```bash
    git clone https://github.com/votre-repo/mys3-client.git
    cd mys3-client
    ```

2.  **Configurez votre environnement :**
    Copiez le fichier d'environnement d'exemple dans un nouveau fichier `.env`.
    ```bash
    cp exemple.env .env
    ```
    Ensuite, ouvrez `.env` et mettez à jour les valeurs pour qu'elles correspondent à la configuration de votre serveur Minio.

3.  **Installez les dépendances :**
    ```bash
    npm install
    ```

## Utilisation

Une fois la configuration terminée, vous pouvez démarrer le serveur :
```bash
npm run mys3
```
Par défaut, l'application sera disponible à l'adresse `http://localhost:9002`.

Vous pouvez spécifier un port différent en utilisant l'indicateur `-p` :
```bash
npm run mys3 -- -p 9003
```

Le serveur utilise `nodemon`, il redémarrera donc automatiquement lorsque vous apporterez des modifications au code.
