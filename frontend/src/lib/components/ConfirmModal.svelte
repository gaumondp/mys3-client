<script lang="ts">
	import { hideModal } from '$lib/stores.svelte';

	export let title: string;
	export let body: string;
	export let onConfirm: () => void;
	export let buttonTextConfirm = 'Confirm';
	export let buttonTextCancel = 'Cancel';

	function handleConfirm() {
		onConfirm();
		hideModal();
	}
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
	<h2 class="text-xl font-bold mb-4">{title}</h2>
	<p class="mb-6">{body}</p>
	<div class="flex justify-end space-x-2">
		<button
			class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
			on:click={hideModal}
		>
			{buttonTextCancel}
		</button>
		<button
			class="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
			on:click={handleConfirm}
		>
			{buttonTextConfirm}
		</button>
	</div>
</div>
