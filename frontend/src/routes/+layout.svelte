<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import { Modal, initializeStores } from '@skeletonlabs/skeleton';

	initializeStores();
</script>

<Toaster />
<Modal />
<slot />
