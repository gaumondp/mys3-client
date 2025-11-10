<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { EditorView, basicSetup } from 'codemirror';
    import { EditorState } from '@codemirror/state';
    import { javascript } from '@codemirror/lang-javascript';
    import { viewFile, updateFile } from '$lib/api';
    import { toast } from 'svelte-sonner';

    export let filePath: string;
    const dispatch = createEventDispatcher();
    let editorEl: HTMLElement;
    let editor: EditorView;

    onMount(async () => {
        const fileContent = await viewFile(filePath);
        const state = EditorState.create({
            doc: fileContent,
            extensions: [basicSetup, javascript()],
        });
        editor = new EditorView({
            state,
            parent: editorEl,
        });
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

<div class="h-full">
    <div class="flex justify-between items-center mb-4">
        <h3 class="h3">{filePath}</h3>
    <div class="flex space-x-2">
        <button class="btn variant-filled-success" on:click={handleSave}>Save</button>
        <button class="btn variant-filled" on:click={() => dispatch('close')}>Close File</button>
    </div>
    </div>
    <div bind:this={editorEl} class="h-full border border-surface-200-700-token rounded-md"></div>
</div>
