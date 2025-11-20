<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="container">
	<h1>Login</h1>
	<form method="post" use:enhance>
		<label>
			Username
			<input name="username" required />
		</label>
		<label>
			Password
			<input type="password" name="password" required />
		</label>
		<button>Login</button>
		{#if form?.message}
			<p class="error">{form.message}</p>
		{/if}
	</form>
	<p>Don't have an account? <a href="/register">Register</a></p>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
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
