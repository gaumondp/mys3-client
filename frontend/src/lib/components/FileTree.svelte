<script lang="ts">
	import { listObjects, type S3Object } from '$lib/api';
	import { createEventDispatcher } from 'svelte';
	import FileTree from './FileTree.svelte';

	let { path = '/', onFileSelect }: { path: string; onFileSelect: (path: string) => void } = $props();
	const dispatch = createEventDispatcher();

	let objects = $state<S3Object[]>([]);
	let isOpen = $state(path === '/');
	let isLoading = $state(false);

	async function fetchObjects() {
		if (isOpen) {
			isLoading = true;
			try {
				objects = await listObjects(path);
			} finally {
				isLoading = false;
			}
		}
	}

	function toggle() {
		isOpen = !isOpen;
		if (isOpen) {
			fetchObjects();
		}
		dispatch('folderclick', { path });
	}

	$effect(() => {
		if (isOpen) {
			fetchObjects();
		}
	});

</script>

<div class:ml-4={path !== '/'}>
	{#if path !== '/'}
		<button onclick={toggle} class="text-left w-full hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded">
			<span>{isOpen ? '▼' : '►'}</span>
			{path.split('/').slice(-2, -1)[0]}
		</button>
	{/if}

	{#if isOpen}
		<div class="pl-4">
			{#if isLoading}
				<p>Loading...</p>
			{:else}
				{#each objects as object}
					{#if object.isFolder}
						<FileTree path={object.fullName} {onFileSelect} on:folderclick />
					{:else}
						<button onclick={() => onFileSelect(object.fullName)} class="text-left w-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
							{object.name}
						</button>
					{/if}
				{/each}
			{/if}
		</div>
	{/if}
</div>
