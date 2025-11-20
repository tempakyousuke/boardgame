<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="container">
	<h1>Change Password</h1>
	<form method="post" use:enhance>
		<label>
			Current Password
			<input type="password" name="currentPassword" required />
		</label>
		<label>
			New Password
			<input type="password" name="newPassword" required minlength="6" />
		</label>
		<label>
			Confirm New Password
			<input type="password" name="confirmPassword" required minlength="6" />
		</label>
		<button>Change Password</button>
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
