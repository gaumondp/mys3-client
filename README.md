# MyS3 Client

A lightweight, local web client for managing a Minio (S3-compatible) bucket. Built with Node.js, Express, and Svelte.

## Features

-   **File and Folder Management**: Full CRUD (Create, Read, Update, Delete) operations for files and folders.
-   **In-Browser Editor**: Edit text-based files (`.txt`, `.json`, `.md`, etc.) with a built-in CodeMirror editor.
-   **Modern UI**: A clean, modern, and responsive user interface built with Skeleton UI.
-   **Easy Configuration**: Configure the client with a simple `.env` file.
-   **Self-Contained**: The Express server handles both the backend API and serves the frontend application.

## Requirements

-   **Node.js**: Node.js 20 LTS or higher is required.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/mys3-client.git
    cd mys3-client
    ```

2.  **Configure your environment:**
    Copy the example environment file to a new `.env` file.
    ```bash
    cp exemple.env .env
    ```
    Then, open `.env` and update the values to match your Minio server configuration.

3.  **Install backend dependencies:**
    ```bash
    npm install
    ```

4.  **Install frontend dependencies:**
    ```bash
    cd frontend
    npm install
    cd ..
    ```

## Usage

To start the server, run the following command from the project root:
```bash
npm run mys3
```
By default, the application will be available at `http://localhost:9002`.

You can specify a different port using the `-p` flag:
```bash
npm run mys3 -p 9003
```

The server uses `nodemon`, so it will automatically restart when you make changes to the backend code.

## Development

For a better development experience, you can run the backend server and the frontend development server separately. This allows for hot-reloading of the Svelte application.

1.  **Start the backend server:**
    In the project root, run:
    ```bash
    npm run mys3
    ```

2.  **Start the frontend development server:**
    In a separate terminal, navigate to the `frontend` directory and run:
    ```bash
    cd frontend
    npm run dev
    ```
    The Svelte application will be available at `http://localhost:5173` (or another port if 5173 is in use). The frontend development server will automatically proxy API requests to the backend server running on port 9002.
