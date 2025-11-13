<script lang="ts">
	import { listObjects, createFolder, uploadFiles, deleteObject, renameObject, getFolderContents, deleteFolderRecursive, type S3Object } from '$lib/api';
	import { toast } from 'svelte-sonner';
	import GithubIcon from '$lib/components/icons/GithubIcon.svelte';
	import { showModal } from '$lib/stores.svelte';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import FileTree from '$lib/components/FileTree.svelte';
	import Editor from '$lib/components/Editor.svelte';

	let currentPath = $state('/');
	let objects = $state<S3Object[]>([]);
	let isLoading = $state(true);
	let fileInput = $state<HTMLInputElement>();
	let selectedFile = $state<string | null>(null);
	let fileTreeKey = $state(0);

	async function fetchObjects(path: string) {
		isLoading = true;
		selectedFile = null; // Deselect file when changing directory
		try {
			objects = await listObjects(path);
		} catch (error) {
			toast.error('Failed to fetch objects.');
		} finally {
			isLoading = false;
		}
	}

	$effect(() => {
		fetchObjects(currentPath);
	});

	function handleFileSelect(path: string) {
		const editableExtensions = ['.txt', '.json', '.md', '.js', '.html', '.yml', '.yaml'];
		if (editableExtensions.some(ext => path.endsWith(ext))) {
			selectedFile = path;
		} else {
			toast.info('This file type is not editable.');
		}
	}

	async function handleNewFolder() {
		const folderName = prompt('Enter new folder name:');
		if (folderName) {
			const newPath = currentPath + folderName + '/';
			try {
				await createFolder(newPath);
				toast.success('Folder created successfully!');
				fetchObjects(currentPath); // Refresh the list
			} catch (error) {
				toast.error('Error: Could not create folder.');
			}
		}
	}

	async function confirmFolderDelete(object: S3Object) {
		try {
			const { fileCount, folderCount } = await getFolderContents(object.fullName);
			showModal(ConfirmModal, {
				title: 'Confirm Folder Deletion',
				body: `Are you sure you want to delete the folder "${object.name}" and all ${fileCount} files and ${folderCount} sub-folders it contains? This action cannot be undone.`,
				buttonTextConfirm: 'Delete',
				onConfirm: () => handleFolderDelete(object),
			});
		} catch (error) {
			toast.error('Error: Could not get folder contents.');
		}
	}

	async function handleFolderDelete(object: S3Object) {
		try {
			await deleteFolderRecursive(object.fullName);
			toast.success('Folder deleted successfully!');
			fetchObjects(currentPath); // Refresh the list
			fileTreeKey++;
		} catch (error) {
			toast.error('Error: Could not delete folder.');
		}
	}

	async function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			try {
				await uploadFiles(currentPath, input.files);
				toast.success('Files uploaded successfully!');
				fetchObjects(currentPath); // Refresh the list
			} catch (error) {
				toast.error('Error: Could not upload files.');
			}
		}
	}

	function confirmDelete(object: S3Object) {
		showModal(ConfirmModal, {
			title: 'Confirm Deletion',
			body: `Are you sure you want to delete "${object.name}"?`,
			buttonTextConfirm: 'Delete',
			onConfirm: () => handleDelete(object),
		});
	}

	async function handleDelete(object: S3Object) {
		try {
			await deleteObject(object.fullName);
			toast.success('Object deleted successfully!');
			fetchObjects(currentPath); // Refresh the list
			fileTreeKey++;
		} catch (error) {
			toast.error('Error: Could not delete object.');
		}
	}

	async function handleRename(object: S3Object) {
		const newName = prompt('Enter new name:', object.name);
		if (newName && newName !== object.name) {
			const newPath = object.fullName.replace(object.name, newName);
			try {
				await renameObject(object.fullName, newPath);
				toast.success('Object renamed successfully!');
				fetchObjects(currentPath); // Refresh the list
			} catch (error) {
				toast.error('Error: Could not rename object.');
			}
		}
	}

	function handleFolderClick(event: CustomEvent<string>) {
		const path = event.detail;
		selectedFile = null; // Explicitly close the editor
		currentPath = path;
		fetchObjects(path);
	}
</script>

<div class="h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
	<header class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
		<img src="/logo-mys3client.png" alt="MyS3 Client Logo" class="h-12" />
	</header>

	<div class="flex flex-grow overflow-hidden">
		<!-- Left Panel (File Tree) -->
		<div class="w-1/4 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
			<h2 class="text-2xl font-bold mb-4">Files</h2>
			{#key fileTreeKey}
				<FileTree onFileSelect={handleFileSelect} on:folderclick={handleFolderClick} />
			{/key}
		</div>

		<!-- Right Panel (Content View) -->
		<div class="w-3/4 p-4 overflow-y-auto">
			{#if selectedFile}
				<Editor filePath={selectedFile} on:close={() => selectedFile = null} />
			{:else}
				<div class="flex justify-between items-center mb-4">
					<h2 class="text-2xl font-bold">{currentPath}</h2>
					<div class="flex space-x-2">
						<button
							class="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
							onclick={() => fileInput.click()}
						>
							Upload
						</button>
						<input
							type="file"
							bind:this={fileInput}
							multiple
							class="hidden"
							onchange={handleFileUpload}
						/>
						<button
							class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
							onclick={handleNewFolder}
						>
							New Folder
						</button>
					</div>
				</div>

				<!-- File/folder listing -->
				{#if isLoading}
					<p>Loading...</p>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{#each objects as object}
							<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col justify-between">
								<h3 class="text-lg font-bold mb-2 truncate">{object.name}</h3>
								<div class="flex justify-end space-x-2">
									<button class="px-2 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onclick={() => handleRename(object)}>Rename</button>
									{#if object.isFolder}
										<button class="px-2 py-1 text-sm rounded bg-red-500 hover:bg-red-600 text-white" onclick={() => confirmFolderDelete(object)}>Delete Folder</button>
									{:else}
										<button class="px-2 py-1 text-sm rounded bg-red-500 hover:bg-red-600 text-white" onclick={() => confirmDelete(object)}>Delete File</button>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{/if}
		</div>
	</div>

	<footer class="p-4 border-t border-gray-200 dark:border-gray-700">
		<a href="https://github.com/gaumondp/mys3-client/" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center hover:text-blue-500">
			<GithubIcon className="w-5 h-5 mr-2" />
			<span>View Source on GitHub</span>
		</a>
	</footer>
</div>
