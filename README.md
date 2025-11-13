<div align="center">
  <img src="public/logo-mys3client96.png" alt="MyS3 Client Logo" />
</div>

# MyS3 Client

A lightweight, local web client for managing a Minio (S3-compatible) bucket. Built with Node.js and Express.

## Features

-   **File and Folder Management**: Full CRUD (Create, Read, Update, Delete) operations for files and folders.
-   **In-Browser Editor**: Edit text-based files (`.txt`, `.json`, `.md`, etc.) with a built-in code editor.
-   **Modern UI**: A clean, modern, and responsive user interface.
-   **Easy Configuration**: Configure the client with a simple `.env` file.
-   **Self-Contained**: The Express server handles both the backend API and serves the frontend application.

## Requirements

-   **Node.js**: A Long-Term Support (LTS) version of Node.js is required. The project is tested with Node.js 20.19.0 and higher. Please use an even-numbered version of Node.js (e.g., 20, 22, 24). Non-LTS versions (e.g., 23) are not supported and will cause dependency installation issues.

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

3.  **Install dependencies:**
    ```bash
    npm install
    ```

## Usage

Once the setup is complete, you can start the server:
```bash
npm run mys3
```
By default, the application will be available at `http://localhost:9002`.

You can specify a different port using the `-p` flag:
```bash
npm run mys3 -- -p 9003
```

The server uses `nodemon`, so it will automatically restart when you make changes to the code.
