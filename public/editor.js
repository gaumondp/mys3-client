
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

document.addEventListener('DOMContentLoaded', () => {
    initEditor();

    document.getElementById('close-editor-btn').addEventListener('click', hideEditor);
    document.getElementById('save-btn').addEventListener('click', () => saveFile(false));
    document.getElementById('save-close-btn').addEventListener('click', () => saveFile(true));
});
