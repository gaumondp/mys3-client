<div align="center">
  <img src="../public/logo-mys3client96.png" alt="Logotipo de MyS3 Client" />
</div>

# MyS3 Client

Un cliente web local y ligero para gestionar un bucket de Minio (compatible con S3). Construido con Node.js y Express.

## Características

-   **Gestión de archivos y carpetas**: Operaciones CRUD (Crear, Leer, Actualizar, Eliminar) completas para archivos y carpetas.
-   **Editor en el navegador**: Edita archivos de texto (`.txt`, `.json`, `.md`, etc.) con un editor de código integrado.
-   **Interfaz de usuario moderna**: Una interfaz de usuario limpia, moderna y receptiva.
-   **Configuración sencilla**: Configura el cliente con un simple archivo `.env`.
-   **Autónomo**: El servidor Express gestiona tanto la API de backend como la aplicación de frontend.

## Requisitos

-   **Node.js**: Se requiere una versión de soporte a largo plazo (LTS) de Node.js. El proyecto está probado con Node.js 20.19.0 y superior. Utilice una versión par de Node.js (por ejemplo, 20, 22, 24). Las versiones no LTS (por ejemplo, 23) no son compatibles y causarán problemas de instalación de dependencias.

## Configuración e instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-repo/mys3-client.git
    cd mys3-client
    ```

2.  **Configura tu entorno:**
    Copia el archivo de entorno de ejemplo en un nuevo archivo `.env`.
    ```bash
    cp exemple.env .env
    ```
    Luego, abre `.env` y actualiza los valores para que coincidan con la configuración de tu servidor Minio.

3.  **Instala las dependencias:**
    ```bash
    npm install
    ```

## Uso

Una vez completada la configuración, puedes iniciar el servidor:
```bash
npm run mys3
```
Por defecto, la aplicación estará disponible en `http://localhost:9002`.

Puedes especificar un puerto diferente usando la bandera `-p`:
```bash
npm run mys3 -- -p 9003
```

El servidor utiliza `nodemon`, por lo que se reiniciará automáticamente cuando realices cambios en el código.
