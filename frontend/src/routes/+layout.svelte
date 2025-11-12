<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import Modal from '$lib/components/Modal.svelte';
</script>

<Toaster closeButton duration={2000} />
<Modal />
<slot />
