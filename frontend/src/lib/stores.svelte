<script module lang="ts">
	import type { SvelteComponent } from 'svelte';

	type ModalState = {
		component: typeof SvelteComponent | null;
		props: Record<string, unknown>;
	};

	const initialModalState: ModalState = {
		component: null,
		props: {}
	};

	export const modal = $state(initialModalState);

	export function showModal(component: typeof SvelteComponent, props: Record<string, unknown> = {}) {
		console.log('[stores.svelte] showModal called with component:', component.name, 'and props:', props);
		modal.component = component;
		modal.props = props;
		console.log('[stores.svelte] Modal state after showModal:', modal);
	}

	export function hideModal() {
		console.log('[stores.svelte] hideModal called');
		modal.component = null;
		modal.props = {};
		console.log('[stores.svelte] Modal state after hideModal:', modal);
	}
</script>
