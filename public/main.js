
document.addEventListener('DOMContentLoaded', () => {
    const fileList = document.getElementById('file-list').getElementsByTagName('tbody')[0];
    const breadcrumb = document.getElementById('breadcrumb');
    const loadingIndicator = document.getElementById('loading');
    const languageSelect = document.getElementById('language-select');

    let currentPath = '/';
    let translations = {};

    async function fetchTranslations(lang) {
        try {
            const response = await fetch(`locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translation file for ${lang}`);
            }
            translations = await response.json();
            translatePage();
        } catch (error) {
            console.error('Error fetching translations:', error);
        }
    }

    function translatePage() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = key.split('.').reduce((obj, k) => (obj && obj[k] !== 'undefined') ? obj[k] : key, translations);
            if (translation !== key) {
                element.textContent = translation;
            }
        });
    }

    languageSelect.addEventListener('change', (event) => {
        fetchTranslations(event.target.value);
    });

    async function fetchFiles(path) {
        loadingIndicator.classList.remove('hidden');
        fileList.innerHTML = '';
        try {
            const response = await fetch(`/api/objects?prefix=${encodeURIComponent(path)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch file list');
            }
            const files = await response.json();
            renderFiles(files);
            renderBreadcrumb(path);
        } catch (error) {
            console.error('Error fetching files:', error);
            alert('Could not load files. Please check the console for more information.');
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    }

    function renderFiles(files) {
        // Parent directory link
        if (currentPath !== '/') {
            const parentPath = currentPath.split('/').slice(0, -2).join('/') + '/';
            const row = fileList.insertRow();
            row.className = 'folder-item';
            const cell = row.insertCell();
            cell.colSpan = 2;
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = '..';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentPath = parentPath;
                fetchFiles(currentPath);
            });
            cell.appendChild(link);
        }

        files.forEach(file => {
            const row = fileList.insertRow();
            row.className = file.isFolder ? 'folder-item' : 'file-item';

            const nameCell = row.insertCell();
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = file.name;
            if (file.isFolder) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPath = file.fullName;
                    fetchFiles(currentPath);
                });
            } else {
                // Placeholder for file click action
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(`File clicked: ${file.fullName}`);
                });
            }
            nameCell.appendChild(link);

            const actionsCell = row.insertCell();
            const textFileExtensions = ['.txt', '.json', '.md', '.js', '.css', '.yaml', '.yml', '.xml', '.html'];
            const extension = file.name.substring(file.name.lastIndexOf('.'));

            if (!file.isFolder && textFileExtensions.includes(extension)) {
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit file';
                editButton.setAttribute('data-i18n', 'page.edit_file');
                editButton.addEventListener('click', () => {
                    openFile(file.fullName);
                });
                actionsCell.appendChild(editButton);
            }
        });
    }

    function renderBreadcrumb(path) {
        breadcrumb.innerHTML = '';
        const parts = path.split('/').filter(p => p);
        let current = '/';

        const rootLink = document.createElement('a');
        rootLink.href = '#';
        rootLink.textContent = 'Root';
        rootLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentPath = '/';
            fetchFiles(currentPath);
        });
        breadcrumb.appendChild(rootLink);

        parts.forEach(part => {
            current += part + '/';
            const separator = document.createElement('span');
            separator.textContent = ' > ';
            breadcrumb.appendChild(separator);

            const link = document.createElement('a');
            link.href = '#';
            link.textContent = part;
            const pathToLoad = current;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentPath = pathToLoad;
                fetchFiles(currentPath);
            });
            breadcrumb.appendChild(link);
        });
    }

    // Initial load
    fetchTranslations(languageSelect.value);
    fetchFiles(currentPath);

let editor;
let currentFile = '';

window.openFile = async (filePath) => {
    try {
        const response = await fetch(`/api/files/view?path=${encodeURIComponent(filePath)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch file content');
        }
        const content = await response.text();
        editor.setValue(content);
        currentFile = filePath;
        const extension = filePath.split('.').pop();
        const mode = getModeForExtension(extension);
        editor.setOption('mode', mode);
        showEditor();
    } catch (error) {
        console.error('Error fetching file content:', error);
        alert('Could not load file content. Please check the console for more information.');
    }
}

function initEditor() {
    const editorTextarea = document.getElementById('editor');
    if (editorTextarea) {
        editor = CodeMirror.fromTextArea(editorTextarea, {
            lineNumbers: true,
            mode: 'text/plain'
        });
    }
}

async function openFile(filePath) {
    try {
        const response = await fetch(`/api/files/view?path=${encodeURIComponent(filePath)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch file content');
        }
        const content = await response.text();
        editor.setValue(content);
        currentFile = filePath;
        const extension = filePath.split('.').pop();
        const mode = getModeForExtension(extension);
        editor.setOption('mode', mode);
        showEditor();
    } catch (error) {
        console.error('Error fetching file content:', error);
        alert('Could not load file content. Please check the console for more information.');
    }
}

function getModeForExtension(ext) {
    switch (ext) {
        case 'js':
            return 'javascript';
        case 'json':
            return 'application/json';
        case 'css':
            return 'css';
        case 'html':
            return 'htmlmixed';
        case 'xml':
            return 'xml';
        case 'yaml':
        case 'yml':
            return 'yaml';
        default:
            return 'text/plain';
    }
}


function showEditor() {
    document.getElementById('file-list-container').classList.add('hidden');
    document.getElementById('actions-bar').classList.add('hidden');
    document.getElementById('breadcrumb').classList.add('hidden');
    document.getElementById('editor-container').classList.remove('hidden');
}

function hideEditor() {
    document.getElementById('file-list-container').classList.remove('hidden');
    document.getElementById('actions-bar').classList.remove('hidden');
    document.getElementById('breadcrumb').classList.remove('hidden');
    document.getElementById('editor-container').classList.add('hidden');
}

async function saveFile(andClose) {
    const content = editor.getValue();
    try {
        const response = await fetch('/api/files/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ path: currentFile, content: content })
        });
        if (!response.ok) {
            throw new Error('Failed to save file');
        }
        alert('File saved successfully');
        if (andClose) {
            hideEditor();
        }
    } catch (error) {
        console.error('Error saving file:', error);
        alert('Could not save file. Please check the console for more information.');
    }
}

    initEditor();

    document.getElementById('close-editor-btn').addEventListener('click', hideEditor);
    document.getElementById('save-btn').addEventListener('click', () => saveFile(false));
    document.getElementById('save-close-btn').addEventListener('click', () => saveFile(true));

    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-input');
    const newFolderBtn = document.getElementById('new-folder-btn');

    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async (event) => {
        const files = event.target.files;
        if (files.length === 0) return;

        const formData = new FormData();
        for (const file of files) {
            formData.append('files', file);
        }
        formData.append('prefix', currentPath);

        try {
            const response = await fetch('/api/files/upload', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to upload files');
            }
            alert('Files uploaded successfully!');
            fetchFiles(currentPath);
        } catch (error) {
            console.error('Error uploading files:', error);
            alert('Could not upload files. Please check the console for more information.');
        }
    });

    newFolderBtn.addEventListener('click', async () => {
        const folderName = prompt('Enter new folder name:');
        if (!folderName) return;

        try {
            const response = await fetch('/api/folders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ path: currentPath + folderName + '/' })
            });
            if (!response.ok) {
                throw new Error('Failed to create folder');
            }
            alert('Folder created successfully!');
            fetchFiles(currentPath);
        } catch (error) {
            console.error('Error creating folder:', error);
            alert('Could not create folder. Please check the console for more information.');
        }
    });
});
