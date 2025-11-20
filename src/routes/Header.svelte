<script lang="ts">
	import { page } from '$app/state';
</script>

<header>
	<div class="corner"></div>
	<div class="auth-corner">
		{#if page.data.user}
			<span class="user-greeting">Hello, {page.data.user.displayName}!</span>
			<a href="/change-name">Change Name</a>
			<a href="/change-password">Change Password</a>
			<form action="/logout" method="post">
				<button type="submit">Logout</button>
			</form>
		{:else}
			<a href="/login">Login</a>
			<a href="/register">Register</a>
		{/if}
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	a:hover {
		color: var(--color-theme-1);
	}

	.auth-corner {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0 1rem;
	}

	.auth-corner button {
		background: none;
		border: none;
		cursor: pointer;
		font-family: inherit;
		font-size: inherit;
		font-weight: bold;
		color: var(--color-text);
	}

	.auth-corner button:hover {
		color: var(--color-theme-1);
	}

	.user-greeting {
		font-weight: bold;
		color: var(--color-theme-1);
	}
</style>
