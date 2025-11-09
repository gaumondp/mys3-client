<script lang="ts">
	import { AppShell, AppBar, getModalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { listObjects, createFolder, uploadFiles, deleteObject, renameObject, type S3Object } from '$lib/api';
	import { writable } from 'svelte/store';
	import { toast } from 'svelte-sonner';
	import FileTree from '$lib/components/FileTree.svelte';
	import Editor from '$lib/components/Editor.svelte';

	let currentPath = writable('/');
	let objects = writable<S3Object[]>([]);
	let isLoading = writable(true);
	let fileInput: HTMLInputElement;
	let selectedFile = writable<string | null>(null);

	const modalStore = getModalStore();

	async function fetchObjects(path: string) {
		isLoading.set(true);
		selectedFile.set(null); // Deselect file when changing directory
		try {
			const fetchedObjects = await listObjects(path);
			objects.set(fetchedObjects);
		} catch (error) {
			toast.error('Failed to fetch objects.');
		} finally {
			isLoading.set(false);
		}
	}

	onMount(() => {
		fetchObjects($currentPath);
	});

	function handleFileSelect(path: string) {
		const editableExtensions = ['.txt', '.json', '.md', '.js', '.html', '.yml', '.yaml'];
		if (editableExtensions.some(ext => path.endsWith(ext))) {
			selectedFile.set(path);
		} else {
			// For non-editable files, you might want to implement a download feature
			toast.info('This file type is not editable.');
		}
	}

	async function handleNewFolder() {
		const folderName = prompt('Enter new folder name:');
		if (folderName) {
			const newPath = $currentPath + folderName + '/';
			try {
				await createFolder(newPath);
				toast.success('Folder created successfully!');
				fetchObjects($currentPath); // Refresh the list
			} catch (error) {
				toast.error('Error: Could not create folder.');
			}
		}
	}

	async function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			try {
				await uploadFiles($currentPath, input.files);
				toast.success('Files uploaded successfully!');
				fetchObjects($currentPath); // Refresh the list
			} catch (error) {
				toast.error('Error: Could not upload files.');
			}
		}
	}

	function confirmDelete(object: S3Object) {
		modalStore.trigger({
			type: 'confirm',
			title: 'Confirm Deletion',
			body: `Are you sure you want to delete "${object.name}"?`,
			buttonTextConfirm: 'Delete',
			buttonTextCancel: 'Cancel',
			response: (r) => {
				if (r) handleDelete(object);
			},
		});
	}

	async function handleDelete(object: S3Object) {
		try {
			await deleteObject(object.fullName);
			toast.success('Object deleted successfully!');
			fetchObjects($currentPath); // Refresh the list
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
				fetchObjects($currentPath); // Refresh the list
			} catch (error) {
				toast.error('Error: Could not rename object.');
			}
		}
	}

	function handleFolderClick(event: CustomEvent<string>) {
		const path = event.detail;
		selectedFile.set(null); // Explicitly close the editor
		currentPath.set(path);
		fetchObjects(path);
	}
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">MyS3 Client</strong>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

    <!-- Page Content -->
    <div class="flex h-full">
        <!-- Left Panel (File Tree) -->
        <div class="w-1/4 border-r border-surface-200-700-token p-4">
            <h2 class="h2">Files</h2>
            <FileTree onFileSelect={handleFileSelect} on:folderclick={handleFolderClick} />
        </div>

        <!-- Right Panel (Content View) -->
        <div class="w-3/4 p-4">
			{#if $selectedFile}
				<Editor filePath={$selectedFile} on:close={() => selectedFile.set(null)} />
			{:else}
				<div class="flex justify-between items-center mb-4">
					<h2 class="h2">{$currentPath}</h2>
					<div class="flex space-x-2">
						<button class="btn variant-filled-primary" on:click={() => fileInput.click()}>
							Upload
						</button>
						<input
							type="file"
							bind:this={fileInput}
							multiple
							class="hidden"
							on:change={handleFileUpload}
						/>
						<button class="btn variant-filled" on:click={handleNewFolder}>
							New Folder
						</button>
					</div>
				</div>

				<!-- File/folder listing -->
				{#if $isLoading}
					<p>Loading...</p>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{#each $objects as object}
							<div class="card p-4">
								<h3 class="h3">{object.name}</h3>
								<div class="flex justify-end space-x-2">
									<button class="btn btn-sm variant-soft" on:click={() => handleRename(object)}>Rename</button>
									<button class="btn btn-sm variant-soft-error" on:click={() => confirmDelete(object)}>Delete</button>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{/if}
        </div>
    </div>
</AppShell>
