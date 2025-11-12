<script lang="ts">
	import { getModal, hideModal } from '$lib/stores.svelte';
	const modal = getModal();

	let dialog = $state<HTMLDialogElement>();

	$effect(() => {
		if (modal.component && dialog) {
			dialog.showModal();
		} else if (dialog) {
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
