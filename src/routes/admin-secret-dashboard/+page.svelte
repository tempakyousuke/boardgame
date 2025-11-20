<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Admin Dashboard</h1>

	{#if form?.message}
		<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
			{form.message}
		</div>
	{/if}

	{#if form?.success}
		<div class="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
			Password updated successfully.
		</div>
	{/if}

	<div class="overflow-x-auto">
		<table class="min-w-full border border-gray-200 bg-white">
			<thead>
				<tr>
					<th class="border-b px-4 py-2 text-left">ID</th>
					<th class="border-b px-4 py-2 text-left">Username</th>
					<th class="border-b px-4 py-2 text-left">Display Name</th>
					<th class="border-b px-4 py-2 text-left">Reset Password</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users as user}
					<tr>
						<td class="border-b px-4 py-2 text-sm text-gray-500">{user.id}</td>
						<td class="border-b px-4 py-2">{user.username}</td>
						<td class="border-b px-4 py-2">{user.displayName}</td>
						<td class="border-b px-4 py-2">
							<form
								method="POST"
								action="?/updatePassword"
								use:enhance
								class="flex items-center gap-2"
							>
								<input type="hidden" name="userId" value={user.id} />
								<input
									type="text"
									name="newPassword"
									placeholder="New Password"
									class="rounded border px-2 py-1 text-sm"
									required
									minlength="6"
								/>
								<button
									type="submit"
									class="rounded bg-blue-500 px-2 py-1 text-sm font-bold text-white hover:bg-blue-700"
								>
									Reset
								</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
