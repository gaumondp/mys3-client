<script lang="ts">
	import { onMount } from 'svelte';
	import { listObjects, type S3Object } from '$lib/api';
	import { writable } from 'svelte/store';

	export let path = '';
	export let onFileSelect: (path: string) => void;

	let objects = writable<S3Object[]>([]);
	let isOpen = writable(false);

	async function fetchObjects() {
		if ($isOpen) {
			const fetchedObjects = await listObjects(path);
			objects.set(fetchedObjects);
		}
	}

	function toggle() {
		isOpen.update(open => !open);
		if ($isOpen) {
			fetchObjects();
		}
	}
</script>

<div class="ml-4">
    {#if path}
        <button on:click={toggle} class="text-left w-full">
            {$isOpen ? '[-]' : '[+]'} {path.split('/').slice(-2, -1)[0]}
        </button>
    {/if}

    {#if $isOpen || !path}
        {#await listObjects(path) then initialObjects}
            {#each initialObjects as object}
                {#if object.isFolder}
                    <svelte:self path={object.fullName} {onFileSelect} />
                {:else}
                    <button on:click={() => onFileSelect(object.fullName)} class="text-left w-full pl-4">
                        {object.name}
                    </button>
                {/if}
            {/each}
        {/await}
    {/if}
</div>
