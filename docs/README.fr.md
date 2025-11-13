
# MyS3 Client

Un client web local et léger pour gérer un compartiment Minio (compatible S3). Conçu avec Node.js, Express et Svelte.

## Fonctionnalités

-   **Gestion des fichiers et des dossiers** : Opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) complètes pour les fichiers et les dossiers.
-   **Éditeur intégré au navigateur** : Modifiez des fichiers texte (`.txt`, `.json`, `.md`, etc.) avec un éditeur CodeMirror intégré.
-   **Interface utilisateur moderne** : Une interface utilisateur propre, moderne et réactive, conçue avec Skeleton UI.
-   **Configuration facile** : Configurez le client avec un simple fichier `.env`.
-   **Autonome** : Le serveur Express gère à la fois l'API backend et sert l'application frontend.

## Prérequis

-   **Node.js** : Une version de support à long terme (LTS) de Node.js est requise. Le projet est testé avec Node.js 20.19.0 et les versions ultérieures. Veuillez utiliser une version paire de Node.js (par exemple, 20, 22, 24). Les versions non-LTS (par exemple, 23) ne sont pas prises en charge et entraîneront des problèmes d'installation des dépendances.

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

3.  **Installez les dépendances du backend :**
    ```bash
    npm install
    ```

4.  **Installez les dépendances du frontend :**
    ```bash
    cd frontend
    npm install
    cd ..
    ```

## Utilisation

Après avoir cloné le dépôt ou récupéré de nouvelles modifications, vous devez d'abord compiler le frontend. Exécutez la commande suivante depuis la racine du projet :
```bash
npm run build
```
Cette commande ne doit être exécutée qu'une seule fois après la mise à jour du code. Elle installera les dépendances du frontend et compilera l'application Svelte.

Une fois la compilation terminée, vous pouvez démarrer le serveur :
```bash
npm run mys3
```
Par défaut, l'application sera disponible à l'adresse `http://localhost:9002`.

Vous pouvez spécifier un port différent en utilisant l'indicateur `-p` :
```bash
npm run mys3 -p 9003
```

Le serveur utilise `nodemon`, il redémarrera donc automatiquement lorsque vous apporterez des modifications au code du backend.

## Développement

Pour une meilleure expérience de développement, vous pouvez exécuter le serveur backend et le serveur de développement frontend séparément. Cela permet le rechargement à chaud de l'application Svelte.

1.  **Démarrez le serveur backend :**
    À la racine du projet, exécutez :
    ```bash
    npm run mys3
    ```

2.  **Démarrez le serveur de développement frontend :**
    Dans un terminal séparé, naviguez jusqu'au répertoire `frontend` et exécutez :
    ```bash
    cd frontend
    npm run dev
    ```
    L'application Svelte sera disponible à l'adresse `http://localhost:5173` (ou un autre port si le 5173 est déjà utilisé). Le serveur de développement frontend redirigera automatiquement les requêtes API vers le serveur backend fonctionnant sur le port 9002.
