<script lang="ts">
	import { EditorView, basicSetup } from 'codemirror';
	import { EditorState } from '@codemirror/state';
	import { javascript } from '@codemirror/lang-javascript';
	import { viewFile, updateFile } from '$lib/api';
	import { toast } from 'svelte-sonner';

	let { filePath, close }: { filePath: string; close: () => void } = $props();

	let editorEl: HTMLElement;
	let editor: EditorView;

	$effect(() => {
		async function setupEditor() {
			const fileContent = await viewFile(filePath);
			const state = EditorState.create({
				doc: fileContent,
				extensions: [basicSetup, javascript()],
			});
			editor = new EditorView({
				state,
				parent: editorEl,
			});
		}

		if (editorEl) {
			setupEditor();
		}

		return () => {
			editor?.destroy();
		};
	});

	async function handleSave() {
		if (editor) {
			const content = editor.state.doc.toString();
			try {
				await updateFile(filePath, content);
				toast.success('File saved successfully!');
			} catch (error) {
				toast.error('Error: Could not save file.');
			}
		}
	}
</script>

<div class="h-full flex flex-col">
	<div class="flex justify-between items-center mb-4">
		<h3 class="text-lg font-bold">{filePath}</h3>
		<div class="flex space-x-2">
			<button class="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white" onclick={handleSave}>Save</button>
			<button class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onclick={close}>Close File</button>
		</div>
	</div>
	<div bind:this={editorEl} class="flex-grow h-full border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"></div>
</div>
