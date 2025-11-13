
<script lang="ts">
	import { locale } from 'svelte-i18n';
	import WorldIcon from '$lib/components/icons/WorldIcon.svelte';

	let showMenu = $state(false);

	const languages = [
		{ code: 'en', name: 'English' },
		{ code: 'fr', name: 'Français' },
		{ code: 'es', name: 'Español' },
		{ code: 'de', name: 'Deutsch' }
	];

	function setLocale(langCode: string) {
		locale.set(langCode);
		showMenu = false;
	}
</script>

<div class="relative">
	<button onclick={() => (showMenu = !showMenu)} class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
		<WorldIcon className="w-6 h-6" />
	</button>

	{#if showMenu}
		<div
			class="absolute bottom-full mb-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
		>
			<ul>
				{#each languages as lang}
					<li>
						<button
							onclick={() => setLocale(lang.code)}
							class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
						>
							{lang.name}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
