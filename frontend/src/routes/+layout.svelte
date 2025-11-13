<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import Modal from '$lib/components/Modal.svelte';
	import '$lib/i18n';
	import { locale, waitLocale } from 'svelte-i18n';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	locale.set(data.lang);
</script>

{#await waitLocale()}
	<p>loading...</p>
{:then}
	<Toaster closeButton duration={2000} />
	<Modal />
	{@render children()}
{/await}
