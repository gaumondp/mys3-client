// index.js

// Import necessary modules
require('dotenv').config();
const express = require('express');
const Minio = require('minio');
const multer = require('multer');
const stream = require('stream');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// --- Minio Client Initialization ---
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const bucketName = process.env.MINIO_BUCKET;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve the Svelte frontend
app.use(express.static(path.join(__dirname, 'public')));

// --- S3 API Routes ---

/**
 * Lists objects (files and folders) in the bucket under a specific prefix.
 * @route GET /api/objects
 * @group Objects - Operations about objects
 * @param {string} req.query.prefix - The prefix (folder path) to list objects from.
 * @returns {object} 200 - An array of object information.
 * @returns {Error}  500 - Server error.
 */
app.get('/api/objects', (req, res) => {
  const prefix = req.query.prefix || '';
  const objects = [];
  const stream = minioClient.listObjects(bucketName, prefix, false); // recursive = false

  stream.on('data', (obj) => {
    // When listing non-recursively, the stream sends two types of objects:
    // 1. File objects, which have a 'name' property.
    // 2. Directory objects, which have a 'prefix' property.

    // Exclude the parent folder itself from the list to prevent self-nesting.
    if (obj.name && obj.name !== prefix) { // It's a file
      objects.push({
        name: obj.name.substring(prefix.length),
        fullName: obj.name,
        isFolder: obj.name.endsWith('/'),
        lastModified: obj.lastModified,
        size: obj.size,
      });
    } else if (obj.prefix && obj.prefix !== prefix) { // It's a directory
      objects.push({
        name: obj.prefix.substring(prefix.length),
        fullName: obj.prefix,
        isFolder: true,
        lastModified: null, // listObjects doesn't provide this for directories
        size: 0,
      });
    }
    // Any other object types from the stream are safely ignored.
  });

  stream.on('error', (err) => {
    console.error('Error listing objects:', err);
    res.status(500).send('Failed to list objects');
  });

  stream.on('end', () => {
    res.json(objects);
  });
});

/**
 * Creates a new folder.
 * Folders in S3 are zero-byte objects with a name ending in "/".
 * @route POST /api/folders
 * @param {string} req.body.path - The full path of the new folder.
 */
app.post('/api/folders', async (req, res) => {
  try {
    const folderPath = req.body.path;
    if (!folderPath || !folderPath.endsWith('/')) {
      return res.status(400).send('Invalid folder path. Must end with "/".');
    }
    await minioClient.putObject(bucketName, folderPath, '');
    res.status(201).send('Folder created successfully');
  } catch (err) {
    console.error('Error creating folder:', err);
    res.status(500).send('Failed to create folder');
  }
});

/**
 * Uploads one or more files to the specified path (prefix).
 * @route POST /api/files/upload
 * @param {string} req.body.prefix - The destination folder path.
 */
app.post('/api/files/upload', upload.array('files'), async (req, res) => {
  try {
    const prefix = req.body.prefix || '';
    const uploadPromises = req.files.map((file) => {
      const objectName = prefix + file.originalname.normalize('NFC');
      return minioClient.putObject(bucketName, objectName, file.buffer, file.size);
    });
    await Promise.all(uploadPromises);
    res.status(200).send('Files uploaded successfully');
  } catch (err) {
    console.error('Error uploading files:', err);
    res.status(500).send('Failed to upload files');
  }
});

/**
 * Gets the content of a text-based file.
 * @route GET /api/files/view
 * @param {string} req.query.path - The full path to the file.
 */
app.get('/api/files/view', async (req, res) => {
  try {
    const objectPath = req.query.path;
    const dataStream = await minioClient.getObject(bucketName, objectPath);
    let data = '';
    dataStream.on('data', (chunk) => (data += chunk));
    dataStream.on('end', () => res.send(data));
    dataStream.on('error', (err) => {
        console.error('Error streaming file content:', err);
        res.status(500).send('Failed to read file');
    });
  } catch (err) {
    console.error('Error getting file content:', err);
    res.status(500).send('Failed to get file content');
  }
});

/**
 * Updates the content of a text-based file.
 * @route PUT /api/files/update
 * @param {string} req.body.path - The full path to the file.
 * @param {string} req.body.content - The new content for the file.
 */
app.put('/api/files/update', async (req, res) => {
    try {
        const { path, content } = req.body;
        const buffer = Buffer.from(content, 'utf-8');
        await minioClient.putObject(bucketName, path, buffer);
        res.status(200).send('File updated successfully');
    } catch (err) {
        console.error('Error updating file:', err);
        res.status(500).send('Failed to update file');
    }
});


/**
 * Renames a file or folder.
 * This is implemented as a copy followed by a delete.
 * @route PUT /api/objects/rename
 * @param {string} req.body.oldPath - The current full path of the object.
 * @param {string} req.body.newPath - The new full path for the object.
 */
app.put('/api/objects/rename', async (req, res) => {
  try {
    const { oldPath, newPath } = req.body;
    const conds = new Minio.CopyConditions();
    await minioClient.copyObject(bucketName, newPath, `/${bucketName}/${oldPath}`, conds);
    await minioClient.removeObject(bucketName, oldPath);
    res.status(200).send('Object renamed successfully');
  } catch (err) {
    console.error('Error renaming object:', err);
    res.status(500).send('Failed to rename object');
  }
});

/**
 * Deletes a file or folder.
 * @route DELETE /api/objects
 * @param {string} req.body.path - The full path of the object to delete.
 */
app.delete('/api/objects', async (req, res) => {
  try {
    const objectPath = req.body.path;
    await minioClient.removeObject(bucketName, objectPath);
    res.status(200).send('Object deleted successfully');
  } catch (err) {
    console.error('Error deleting object:', err);
    res.status(500).send('Failed to delete object');
  }
});

// Fallback to the Svelte app for any other requests.
// This route uses a regular expression to match any path that does NOT start with /api.
// This is the correct way to implement a catch-all for a Single Page Application (SPA).
app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Port configuration
let port = process.env.PORT || 9002;
const portArgIndex = process.argv.indexOf('-p');
if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
  const parsedPort = parseInt(process.argv[portArgIndex + 1], 10);
  if (!isNaN(parsedPort)) {
    port = parsedPort;
  }
}

// Start the server
app.listen(port, () => {
  console.log('\x1b[32m%s\x1b[0m', `MyS3 Web Client is ready! Access it here: http://localhost:${port}`);
});
