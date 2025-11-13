<svelte:head>
	<title>MyS3 Client</title>
</svelte:head>

<script lang="ts">
	import { listObjects, createFolder, uploadFiles, deleteObject, renameObject, getFolderContents, deleteFolderRecursive, type S3Object } from '$lib/api';
	import { toast } from 'svelte-sonner';
	import GithubIcon from '$lib/components/icons/GithubIcon.svelte';
	import { showModal } from '$lib/stores.svelte';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import FileTree from '$lib/components/FileTree.svelte';
	import Editor from '$lib/components/Editor.svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import { _ } from 'svelte-i18n';

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
			toast.error($_('toasts.fetch_objects_error'));
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
			toast.info($_('toasts.not_editable_error'));
		}
	}

	async function handleNewFolder() {
		const folderName = prompt($_('toasts.create_folder_prompt'));
		if (folderName) {
			const newPath = currentPath + folderName + '/';
			try {
				await createFolder(newPath);
				toast.success($_('toasts.create_folder_success'));
				fetchObjects(currentPath); // Refresh the list
			} catch (error) {
				toast.error($_('toasts.create_folder_error'));
			}
		}
	}

	async function confirmFolderDelete(object: S3Object) {
		try {
			const { fileCount, folderCount } = await getFolderContents(object.fullName);
			showModal(ConfirmModal, {
				title: $_('confirm_delete.erase_folder_title'),
				body: $_('confirm_delete.erase_folder_body', { values: { folderName: object.name, fileCount, folderCount } }),
				buttonTextConfirm: $_('confirm_delete.confirm'),
				onConfirm: () => handleFolderDelete(object),
			});
		} catch (error) {
			toast.error($_('toasts.get_folder_contents_error'));
		}
	}

	async function handleFolderDelete(object: S3Object) {
		try {
			await deleteFolderRecursive(object.fullName);
			toast.success($_('toasts.delete_folder_success'));
			fetchObjects(currentPath); // Refresh the list
			fileTreeKey++;
		} catch (error) {
			toast.error($_('toasts.delete_folder_error'));
		}
	}

	async function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			try {
				await uploadFiles(currentPath, input.files);
				toast.success($_('toasts.upload_files_success'));
				fetchObjects(currentPath); // Refresh the list
			} catch (error) {
				toast.error($_('toasts.upload_files_error'));
			}
		}
	}

	function confirmDelete(object: S3Object) {
		showModal(ConfirmModal, {
			title: $_('confirm_delete.erase_file_title'),
			body: $_('confirm_delete.erase_file_body', { values: { fileName: object.name } }),
			buttonTextConfirm: $_('confirm_delete.confirm'),
			onConfirm: () => handleDelete(object),
		});
	}

	async function handleDelete(object: S3Object) {
		try {
			await deleteObject(object.fullName);
			toast.success($_('toasts.delete_object_success'));
			fetchObjects(currentPath); // Refresh the list
			fileTreeKey++;
		} catch (error) {
			toast.error($_('toasts.delete_object_error'));
		}
	}

	async function handleRename(object: S3Object) {
		const newName = prompt($_('toasts.rename_object_prompt'), object.name);
		if (newName && newName !== object.name) {
			const newPath = object.fullName.replace(object.name, newName);
			try {
				await renameObject(object.fullName, newPath);
				toast.success($_('toasts.rename_object_success'));
				fetchObjects(currentPath); // Refresh the list
			} catch (error) {
				toast.error($_('toasts.rename_object_error'));
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
			<h2 class="text-2xl font-bold mb-4">{$_('page.files')}</h2>
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
							{$_('page.upload')}
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
							{$_('page.new_folder')}
						</button>
					</div>
				</div>

				<!-- File/folder listing -->
				{#if isLoading}
					<p>{$_('page.loading')}</p>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{#each objects as object}
							<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col justify-between">
								<h3 class="text-lg font-bold mb-2 truncate">{object.name}</h3>
								<div class="flex justify-end space-x-2">
									<button class="px-2 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onclick={() => handleRename(object)}>{$_('page.rename')}</button>
									{#if object.isFolder}
										<button class="px-2 py-1 text-sm rounded bg-red-500 hover:bg-red-600 text-white" onclick={() => confirmFolderDelete(object)}>{$_('page.delete_folder')}</button>
									{:else}
										<button class="px-2 py-1 text-sm rounded bg-red-500 hover:bg-red-600 text-white" onclick={() => confirmDelete(object)}>{$_('page.delete_file')}</button>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{/if}
		</div>
	</div>

	<footer class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
		<LanguageSwitcher />
		<a href="https://github.com/gaumondp/mys3-client/" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center hover:text-blue-500">
			<GithubIcon className="w-5 h-5 mr-2" />
			<span>{$_('page.view_source')}</span>
		</a>
		<div></div>
	</footer>
</div>
