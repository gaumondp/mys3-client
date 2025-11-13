
# Cliente MyS3

Un cliente web local y ligero para gestionar un bucket de Minio (compatible con S3). Construido con Node.js, Express y Svelte.

## Características

-   **Gestión de archivos y carpetas**: Operaciones CRUD (Crear, Leer, Actualizar, Eliminar) completas para archivos y carpetas.
-   **Editor en el navegador**: Edite archivos de texto (`.txt`, `.json`, `.md`, etc.) con un editor CodeMirror integrado.
-   **Interfaz de usuario moderna**: Una interfaz de usuario limpia, moderna y receptiva construida con Skeleton UI.
-   **Configuración sencilla**: Configure el cliente con un simple archivo `.env`.
-   **Autónomo**: El servidor Express se encarga tanto de la API de backend como de servir la aplicación de frontend.

## Requisitos

-   **Node.js**: Se requiere una versión de soporte a largo plazo (LTS) de Node.js. El proyecto está probado con Node.js 20.19.0 y versiones posteriores. Utilice una versión par de Node.js (por ejemplo, 20, 22, 24). Las versiones no LTS (por ejemplo, 23) no son compatibles y causarán problemas de instalación de dependencias.

## Configuración e instalación

1.  **Clone el repositorio:**
    ```bash
    git clone https://github.com/su-repo/mys3-client.git
    cd mys3-client
    ```

2.  **Configure su entorno:**
    Copie el archivo de entorno de ejemplo a un nuevo archivo `.env`.
    ```bash
    cp exemple.env .env
    ```
    Luego, abra `.env` y actualice los valores para que coincidan con la configuración de su servidor Minio.

3.  **Instale las dependencias del backend:**
    ```bash
    npm install
    ```

4.  **Instale las dependencias del frontend:**
    ```bash
    cd frontend
    npm install
    cd ..
    ```

## Uso

Después de clonar el repositorio o de obtener nuevos cambios, primero debe compilar el frontend. Ejecute el siguiente comando desde la raíz del proyecto:
```bash
npm run build
```
Este comando solo necesita ejecutarse una vez después de actualizar el código. Instalará las dependencias del frontend y compilará la aplicación Svelte.

Una vez que la compilación esté completa, puede iniciar el servidor:
```bash
npm run mys3
```
Por defecto, la aplicación estará disponible en `http://localhost:9002`.

Puede especificar un puerto diferente utilizando la bandera `-p`:
```bash
npm run mys3 -p 9003
```

El servidor utiliza `nodemon`, por lo que se reiniciará automáticamente cuando realice cambios en el código del backend.

## Desarrollo

Para una mejor experiencia de desarrollo, puede ejecutar el servidor de backend y el servidor de desarrollo de frontend por separado. Esto permite la recarga en caliente de la aplicación Svelte.

1.  **Inicie el servidor de backend:**
    En la raíz del proyecto, ejecute:
    ```bash
    npm run mys3
    ```

2.  **Inicie el servidor de desarrollo de frontend:**
    En una terminal separada, navegue al directorio `frontend` y ejecute:
    ```bash
    cd frontend
    npm run dev
    ```
    La aplicación Svelte estará disponible en `http://localhost:5173` (u otro puerto si el 5173 está en uso). El servidor de desarrollo de frontend redirigirá automáticamente las solicitudes de la API al servidor de backend que se ejecuta en el puerto 9002.
