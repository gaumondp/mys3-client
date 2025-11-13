<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import Modal from '$lib/components/Modal.svelte';
	import { browser } from '$app/environment';
	import '$lib/i18n';
	import { locale, waitLocale } from 'svelte-i18n';

	if (browser) {
		locale.set(window.navigator.language);
	}
	$effect(() => {
		async function start() {
			await waitLocale();
		}
		start();
	});
</script>

<Toaster closeButton duration={2000} />
<Modal />
{@render children()}
