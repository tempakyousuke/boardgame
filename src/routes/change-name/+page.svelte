<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { form: ActionData; data: PageData } = $props();
</script>

<div class="container">
	<h1>Change Display Name</h1>
	<p class="current-name">Current: {data.currentDisplayName}</p>
	<form method="post" use:enhance>
		<label>
			New Display Name
			<input
				type="text"
				name="displayName"
				required
				maxlength="50"
				value={data.currentDisplayName}
			/>
		</label>
		<button>Change Name</button>
		{#if form?.message}
			<p class="error">{form.message}</p>
		{/if}
	</form>
	<p><a href="/">Back to Home</a></p>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
	.current-name {
		color: #666;
		margin-bottom: 1rem;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 300px;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	button {
		padding: 0.5rem;
		background-color: #333;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	.error {
		color: red;
	}
</style>
