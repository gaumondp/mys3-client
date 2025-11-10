<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import { Modal, initializeStores } from '@skeletonlabs/skeleton';

	initializeStores();
</script>

<Toaster closeButton duration={2000} />
<Modal />
<slot />
