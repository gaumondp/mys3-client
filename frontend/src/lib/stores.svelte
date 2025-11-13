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
		modal.component = component;
		modal.props = props;
	}

	export function hideModal() {
		modal.component = null;
		modal.props = {};
	}
</script>
