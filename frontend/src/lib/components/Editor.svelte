<script lang="ts">
	import { viewFile, updateFile } from '$lib/api';
	import { toast } from 'svelte-sonner';

	let { filePath, close }: { filePath: string; close: () => void } = $props();

	async function handleSave() {
		// todo: implement save
	}
</script>

<div class="h-full flex flex-col">
	<div class="flex justify-between items-center mb-4">
		<h3 class="text-lg font-bold">{filePath}</h3>
		<div class="flex space-x-2">
			<button class="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white" onclick={handleSave}>Save</button>
			<button class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onclick={close}>Close File</button>
		</div>
	</div>
	<div class="flex-grow h-full border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"></div>
</div>
