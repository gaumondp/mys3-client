// src/lib/api.ts

const BASE_URL = '/api';

// Helper function to add a cache-busting parameter if nocache=true is in the URL
function getUrlWithCacheBust(url: string): string {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('nocache')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}t=${Date.now()}`;
    }
    return url;
}

export interface S3Object {
    name: string;
    fullName: string;
    isFolder: boolean;
    lastModified: string;
    size: number;
}

/**
 * Lists objects from a given prefix.
 * @param prefix The prefix to list from.
 * @returns A promise that resolves to an array of S3 objects.
 */
export async function listObjects(prefix = ''): Promise<S3Object[]> {
    const url = getUrlWithCacheBust(`${BASE_URL}/objects?prefix=${encodeURIComponent(prefix)}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch objects');
    }
    return await response.json();
}

/**
 * Creates a new folder.
 * @param path The full path of the new folder.
 * @returns A promise that resolves when the folder is created.
 */
export async function createFolder(path: string): Promise<void> {
    const url = getUrlWithCacheBust(`${BASE_URL}/folders`);
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
    });
    if (!response.ok) {
        throw new Error('Failed to create folder');
    }
}

/**
 * Uploads files to a given prefix.
 * @param prefix The destination prefix.
 * @param files The files to upload.
 * @returns A promise that resolves when the files are uploaded.
 */
export async function uploadFiles(prefix: string, files: FileList): Promise<void> {
    const formData = new FormData();
    formData.append('prefix', prefix);
    for (const file of files) {
        formData.append('files', file);
    }
    const url = getUrlWithCacheBust(`${BASE_URL}/files/upload`);
    const response = await fetch(url, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        throw new Error('Failed to upload files');
    }
}

/**
 * Fetches the content of a text file.
 * @param path The full path of the file.
 * @returns A promise that resolves to the file content as a string.
 */
export async function viewFile(path: string): Promise<string> {
    const url = getUrlWithCacheBust(`${BASE_URL}/files/view?path=${encodeURIComponent(path)}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to view file');
    }
    return await response.text();
}

/**
 * Updates the content of a text file.
 * @param path The full path of the file.
 * @param content The new content.
 * @returns A promise that resolves when the file is updated.
 */
export async function updateFile(path: string, content: string): Promise<void> {
    const url = getUrlWithCacheBust(`${BASE_URL}/files/update`);
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, content }),
    });
    if (!response.ok) {
        throw new Error('Failed to update file');
    }
}

/**
 * Renames an object.
 * @param oldPath The current path of the object.
 * @param newPath The new path for the object.
 * @returns A promise that resolves when the object is renamed.
 */
export async function renameObject(oldPath: string, newPath: string): Promise<void> {
    const url = getUrlWithCacheBust(`${BASE_URL}/objects/rename`);
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPath, newPath }),
    });
    if (!response.ok) {
        throw new Error('Failed to rename object');
    }
}

/**
 * Deletes an object.
 * @param path The path of the object to delete.
 * @returns A promise that resolves when the object is deleted.
 */
export async function deleteObject(path: string): Promise<void> {
    const url = getUrlWithCacheBust(`${BASE_URL}/objects`);
    const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
    });
    if (!response.ok) {
        throw new Error('Failed to delete object');
    }
}

/**
 * Gets the contents of a folder.
 * @param path The path of the folder.
 * @returns A promise that resolves to the folder contents.
 */
export async function getFolderContents(path: string): Promise<{ fileCount: number; folderCount: number }> {
    const url = getUrlWithCacheBust(`${BASE_URL}/folders/contents?path=${encodeURIComponent(path)}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to get folder contents');
    }
    return await response.json();
}

/**
 * Deletes a folder recursively.
 * @param path The path of the folder to delete.
 * @returns A promise that resolves when the folder is deleted.
 */
export async function deleteFolderRecursive(path: string): Promise<void> {
    const url = getUrlWithCacheBust(`${BASE_URL}/folders/recursive`);
    const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
    });
    if (!response.ok) {
        throw new Error('Failed to delete folder');
    }
}
