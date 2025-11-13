<script lang="ts">
	import { modal, hideModal } from '$lib/stores.svelte';

	let dialog = $state<HTMLDialogElement>();

	$effect(() => {
		console.log('[Modal.svelte] Effect triggered. Modal component is:', modal.component ? modal.component.name : null);
		if (modal.component && dialog) {
			console.log('[Modal.svelte] Attempting to show dialog.');
			dialog.showModal();
		} else if (dialog) {
			console.log('[Modal.svelte] Attempting to close dialog.');
			dialog.close();
		}
	});
</script>

{#if modal.component}
	<dialog
		bind:this={dialog}
		onclose={hideModal}
		class="p-0 border-none rounded-lg shadow-xl bg-transparent"
	>
		{@render modal.component(modal.props)}
	</dialog>
{/if}

<style>
	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
