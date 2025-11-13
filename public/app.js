document.addEventListener('DOMContentLoaded', () => {
    const app = {
        lang: 'en',
        translations: {},
        currentPath: '/',
    };

    // --- DOM Elements ---
    const fileListBody = document.querySelector('#file-list tbody');
    const loadingIndicator = document.getElementById('loading');
    const langSelect = document.getElementById('language-select');
    const breadcrumbNav = document.getElementById('breadcrumb');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const closeModalBtn = document.querySelector('.close-btn');
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-input');
    const newFolderBtn = document.getElementById('new-folder-btn');
    const toastContainer = document.getElementById('toast-container');

    // --- Icons ---
    const folderIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
    const fileIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>`;

    // --- i18n ---
    const getNestedTranslation = (key, obj) => key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);

    const translateUI = () => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = getNestedTranslation(key, app.translations);
            if (translation) el.textContent = translation;
        });
    };

    const loadTranslations = async (lang) => {
        try {
            const response = await fetch(`/locales/${lang}.json`);
            if (!response.ok) {
                if (lang !== 'en') await loadTranslations('en');
                return;
            }
            app.translations = await response.json();
            app.lang = lang;
            document.documentElement.lang = lang;
            localStorage.setItem('userLang', lang);
            translateUI();
            fetchObjects(app.currentPath);
        } catch (error) {
            console.error('Error loading translation file:', error);
        }
    };

    // --- UI & Notifications ---
    const showToast = (key, type = 'success') => {
        const message = getNestedTranslation(key, app.translations) || key;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }, 10);
    };

    const showModal = (config) => {
        modalTitle.textContent = config.title;
        modalBody.textContent = config.body;
        modalConfirmBtn.textContent = config.confirmText || 'Confirm';
        modalConfirmBtn.className = `confirm-btn ${config.confirmClass || ''}`;
        modal.classList.remove('hidden');

        return new Promise((resolve) => {
            const confirmHandler = () => {
                cleanup();
                resolve(true);
            };
            const cancelHandler = () => {
                cleanup();
                resolve(false);
            };
            const cleanup = () => {
                modalConfirmBtn.removeEventListener('click', confirmHandler);
                modalCancelBtn.removeEventListener('click', cancelHandler);
                closeModalBtn.removeEventListener('click', cancelHandler);
                modal.classList.add('hidden');
            };

            modalConfirmBtn.addEventListener('click', confirmHandler);
            modalCancelBtn.addEventListener('click', cancelHandler);
            closeModalBtn.addEventListener('click', cancelHandler);
        });
    };

    // --- API Calls ---
    const apiCall = async (endpoint, options) => {
        try {
            const response = await fetch(endpoint, options);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }
            return response;
        } catch (error) {
            console.error(`API call to ${endpoint} failed:`, error);
            throw error;
        }
    };

    // --- Actions ---
    const handleNewFolder = async () => {
        const folderName = prompt(getNestedTranslation('toasts.create_folder_prompt', app.translations));
        if (folderName) {
            try {
                const folderPath = `${app.currentPath}${folderName}/`;
                await apiCall('/api/folders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ path: folderPath }),
                });
                showToast('toasts.create_folder_success');
                fetchObjects(app.currentPath);
            } catch (error) {
                showToast('toasts.create_folder_error', 'error');
            }
        }
    };

    const handleUpload = async () => {
        const files = fileInput.files;
        if (files.length === 0) return;

        const formData = new FormData();
        for (const file of files) {
            formData.append('files', file);
        }
        formData.append('prefix', app.currentPath);

        try {
            await apiCall('/api/files/upload', { method: 'POST', body: formData });
            showToast('toasts.upload_files_success');
            fetchObjects(app.currentPath);
        } catch (error) {
            showToast('toasts.upload_files_error', 'error');
        }
        fileInput.value = ''; // Reset input
    };

    const handleDelete = async (obj) => {
        const isFolder = obj.isFolder;
        let title, body;

        if (isFolder) {
            title = getNestedTranslation('confirm_delete.erase_folder_title', app.translations);
            body = getNestedTranslation('confirm_delete.erase_folder_body', app.translations)
                .replace('{folderName}', obj.name);
            // We'd need another API call to get folder contents count, simplifying for now.
            body = body.replace('{fileCount}', 'some').replace('{folderCount}', 'any');
        } else {
            title = getNestedTranslation('confirm_delete.erase_file_title', app.translations);
            body = getNestedTranslation('confirm_delete.erase_file_body', app.translations)
                .replace('{fileName}', obj.name);
        }

        const confirmed = await showModal({
            title, body,
            confirmText: getNestedTranslation('confirm_delete.confirm', app.translations),
            confirmClass: 'delete-btn'
        });

        if (confirmed) {
            try {
                const endpoint = isFolder ? '/api/folders/recursive' : '/api/objects';
                await apiCall(endpoint, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ path: obj.fullName }),
                });
                showToast('toasts.delete_object_success');
                fetchObjects(app.currentPath);
            } catch (error) {
                showToast('toasts.delete_object_error', 'error');
            }
        }
    };

    const handleRename = async (obj) => {
        const newName = prompt(getNestedTranslation('toasts.rename_object_prompt', app.translations), obj.name.replace('/', ''));
        if (newName && newName !== obj.name) {
            try {
                const newPath = `${app.currentPath}${newName}${obj.isFolder ? '/' : ''}`;
                await apiCall('/api/objects/rename', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ oldPath: obj.fullName, newPath: newPath }),
                });
                showToast('toasts.rename_object_success');
                fetchObjects(app.currentPath);
            } catch (error) {
                showToast('toasts.rename_object_error', 'error');
            }
        }
    };

    // --- Rendering ---
    const renderObjects = (objects) => {
        fileListBody.innerHTML = '';
        objects.sort((a, b) => {
            if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1;
            return a.name.localeCompare(b.name);
        });

        if (objects.length === 0) {
            fileListBody.innerHTML = `<tr><td colspan="2" style="text-align: center;">Folder is empty.</td></tr>`; // i18n
            return;
        }

        objects.forEach(obj => {
            const tr = document.createElement('tr');
            const nameCell = obj.isFolder ? `<a href="#" class="folder-link" data-path="${obj.fullName}">${obj.name}</a>` : `<span>${obj.name}</span>`;
            tr.innerHTML = `
                <td><div style="display: flex; align-items: center; gap: 10px;">${obj.isFolder ? folderIcon : fileIcon}${nameCell}</div></td>
                <td></td>`;

            const actionsCell = tr.querySelector('td:last-child');
            const renameBtn = document.createElement('button');
            renameBtn.className = 'action-btn rename-btn';
            renameBtn.textContent = getNestedTranslation('page.rename', app.translations);
            renameBtn.onclick = () => handleRename(obj);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn delete-btn';
            deleteBtn.textContent = getNestedTranslation(obj.isFolder ? 'page.delete_folder' : 'page.delete_file', app.translations);
            deleteBtn.onclick = () => handleDelete(obj);

            actionsCell.appendChild(renameBtn);
            actionsCell.appendChild(deleteBtn);
            fileListBody.appendChild(tr);
        });
    };

    const fetchObjects = async (path) => {
        loadingIndicator.classList.remove('hidden');
        try {
            const response = await apiCall(`/api/objects?prefix=${encodeURIComponent(path)}`);
            const objects = await response.json();
            app.currentPath = path;
            renderObjects(objects);
            renderBreadcrumb(path);
        } catch (error) {
            showToast('toasts.fetch_objects_error', 'error');
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    };

    const renderBreadcrumb = (path) => {
        breadcrumbNav.innerHTML = '';
        const parts = path.split('/').filter(Boolean);
        let currentPath = ''; // Start with an empty path
        const root = document.createElement('a');
        root.href = '#';
        root.textContent = 'Root';
        root.dataset.path = '/'; // Root is always '/'
        breadcrumbNav.appendChild(root);

        parts.forEach(part => {
            currentPath += `${part}/`; // Append folder and slash
            breadcrumbNav.append(' / ');
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = part;
            link.dataset.path = currentPath;
            breadcrumbNav.appendChild(link);
        });
    };

    // --- Event Listeners ---
    fileListBody.addEventListener('click', e => {
        const link = e.target.closest('.folder-link');
        if (link) { e.preventDefault(); fetchObjects(link.dataset.path); }
    });
    breadcrumbNav.addEventListener('click', e => {
        if (e.target.tagName === 'A') { e.preventDefault(); fetchObjects(e.target.dataset.path); }
    });
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleUpload);
    newFolderBtn.addEventListener('click', handleNewFolder);

    // --- Init ---
    const init = () => {
        langSelect.addEventListener('change', e => loadTranslations(e.target.value));
        const userLang = localStorage.getItem('userLang') || navigator.language.split('-')[0];
        const supported = ['en', 'fr', 'de', 'es'];
        langSelect.value = supported.includes(userLang) ? userLang : 'en';
        loadTranslations(langSelect.value);
        console.log("App loaded.");
    };

    init();
});
