<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import Modal from '$lib/components/Modal.svelte';
	import '$lib/i18n';
	import { locale, waitLocale } from 'svelte-i18n';
	import type { LayoutData } from './$types';

	let { data }: { data: LayoutData } = $props();
	locale.set(data.lang);
</script>

{#await waitLocale()}
	<p>loading...</p>
{:then}
	<Toaster closeButton duration={2000} />
	<Modal />
	<slot />
{/await}
