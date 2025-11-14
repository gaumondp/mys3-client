
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
});
