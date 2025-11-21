<script lang="ts">
	import type { PageData } from './$types';
	import type { TetsudoSquare, TetsudoPath, TetsudoProperty } from '$lib/server/db/schema';

	let { data }: { data: PageData } = $props();

	let squares = $state<TetsudoSquare[]>(data.squares);
	let paths = $state<TetsudoPath[]>(data.paths);
	let properties = $state<TetsudoProperty[]>(data.properties);

	let selectedSquareId = $state<string | null>(null);
	let connectingSquareId = $state<string | null>(null);
	let draggedSquareId = $state<string | null>(null);

	let squareProperties = $derived(
		selectedSquareId ? properties.filter((p) => p.squareId === selectedSquareId) : []
	);

	// Mouse position for dragging
	let dragOffsetX = 0;
	let dragOffsetY = 0;

	function handleSvgClick(event: MouseEvent) {
		// If clicking empty space and not dragging/connecting, create a square
		if (event.target === event.currentTarget) {
			const rect = (event.currentTarget as Element).getBoundingClientRect();
			const x = Math.round(event.clientX - rect.left);
			const y = Math.round(event.clientY - rect.top);
			createSquare(x, y);

			// Only deselect if we clicked the background
			selectedSquareId = null;
			connectingSquareId = null;
		}
	}

	async function createSquare(x: number, y: number) {
		const id = crypto.randomUUID();
		const newSquare: TetsudoSquare = {
			id,
			type: 'blue',
			name: '',
			x,
			y,
			metadata: null
		};
		squares = [...squares, newSquare];
		await saveSquare(newSquare);
	}

	async function saveSquare(square: TetsudoSquare) {
		await fetch('/api/tetsudo/admin/squares', {
			method: 'POST',
			body: JSON.stringify(square)
		});
	}

	async function deleteSquare(id: string) {
		squares = squares.filter((s) => s.id !== id);
		paths = paths.filter((p) => p.square1Id !== id && p.square2Id !== id);
		// Also delete properties
		await fetch('/api/tetsudo/admin/squares', {
			method: 'DELETE',
			body: JSON.stringify({ id })
		});
	}

	function handleSquareMouseDown(event: MouseEvent, id: string) {
		event.stopPropagation();
		if (event.button === 0) {
			// Left click
			if (connectingSquareId) {
				// Finish connection
				createPath(connectingSquareId, id);
				connectingSquareId = null;
			} else {
				// Start drag or select
				selectedSquareId = id;
				draggedSquareId = id;
				const square = squares.find((s) => s.id === id);
				if (square) {
					dragOffsetX = event.clientX - square.x;
					dragOffsetY = event.clientY - square.y;
				}
			}
		} else if (event.button === 2) {
			// Right click
			// Maybe context menu? For now just select
			selectedSquareId = id;
		}
	}

	function handleMouseMove(event: MouseEvent) {
		if (draggedSquareId) {
			const square = squares.find((s) => s.id === draggedSquareId);
			if (square) {
				// Calculate new position relative to SVG container
				// We need the container rect, but we can approximate or use the offset
				// A simpler way is to update based on delta, but let's try to be precise if we can get the container
				// For now, let's assume the mouse move is global and we update the square
				// We need to convert client coordinates back to SVG coordinates
				// This is tricky without the container ref.
				// Let's use a simpler approach: update locally and save on mouse up.

				// Actually, we need the container to calculate X/Y correctly.
				const container = document.getElementById('map-container');
				if (container) {
					const rect = container.getBoundingClientRect();
					square.x = Math.round(event.clientX - rect.left);
					square.y = Math.round(event.clientY - rect.top);
				}
			}
		}
	}

	async function handleMouseUp() {
		if (draggedSquareId) {
			const square = squares.find((s) => s.id === draggedSquareId);
			if (square) {
				await saveSquare(square);
			}
			draggedSquareId = null;
		}
	}

	async function createPath(id1: string, id2: string) {
		if (id1 === id2) return;
		// Check if exists
		const exists = paths.some(
			(p) =>
				(p.square1Id === id1 && p.square2Id === id2) || (p.square1Id === id2 && p.square2Id === id1)
		);
		if (exists) return;

		const id = crypto.randomUUID();
		const newPath: TetsudoPath = {
			id,
			square1Id: id1,
			square2Id: id2
		};
		paths = [...paths, newPath];
		await fetch('/api/tetsudo/admin/paths', {
			method: 'POST',
			body: JSON.stringify(newPath)
		});
	}

	function startConnection() {
		if (selectedSquareId) {
			connectingSquareId = selectedSquareId;
			selectedSquareId = null;
		}
	}

	// Helper to get square center
	function getSquare(id: string) {
		return squares.find((s) => s.id === id);
	}

	async function addProperty(squareId: string) {
		const id = crypto.randomUUID();
		const newProp: TetsudoProperty = {
			id,
			squareId,
			name: 'New Property',
			price: 1000,
			profitRate: 10,
			type: 'food'
		};
		properties = [...properties, newProp];
		await saveProperty(newProp);
	}

	async function saveProperty(prop: TetsudoProperty) {
		await fetch('/api/tetsudo/admin/properties', {
			method: 'POST',
			body: JSON.stringify(prop)
		});
	}

	async function deleteProperty(id: string) {
		properties = properties.filter((p) => p.id !== id);
		await fetch('/api/tetsudo/admin/properties', {
			method: 'DELETE',
			body: JSON.stringify({ id })
		});
	}
</script>

<svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp} />

<div class="flex h-screen gap-4 p-4">
	<!-- Sidebar -->
	<div class="flex w-64 flex-shrink-0 flex-col gap-4">
		<h1 class="text-xl font-bold">Map Editor</h1>

		<div class="rounded border bg-white p-4 shadow">
			<h2 class="mb-2 font-bold">Tools</h2>
			<p class="mb-2 text-sm text-gray-600">
				Click empty space to add square.<br />
				Drag squares to move.<br />
				Select square to edit.<br />
			</p>
			{#if selectedSquareId}
				<div class="mt-4 flex flex-col gap-2">
					<button class="rounded bg-blue-500 px-2 py-1 text-white" onclick={startConnection}>
						Connect Path
					</button>
					<button
						class="rounded bg-red-500 px-2 py-1 text-white"
						onclick={() => selectedSquareId && deleteSquare(selectedSquareId)}
					>
						Delete Square
					</button>
				</div>
			{/if}
			{#if connectingSquareId}
				<div class="mt-2 bg-yellow-100 p-2 text-sm">Select another square to connect.</div>
			{/if}
		</div>

		{#if selectedSquareId}
			{@const selectedSquare = squares.find((s) => s.id === selectedSquareId)}
			{#if selectedSquare}
				<div class="rounded border bg-white p-4 shadow">
					<h2 class="mb-2 font-bold">Edit Square</h2>
					<label class="block text-sm">
						Name
						<input
							type="text"
							class="w-full rounded border px-1"
							bind:value={selectedSquare.name}
							onchange={() => saveSquare(selectedSquare)}
						/>
					</label>
					<label class="mt-2 block text-sm">
						Type
						<select
							class="w-full rounded border px-1"
							bind:value={selectedSquare.type}
							onchange={() => saveSquare(selectedSquare)}
						>
							<option value="blue">Blue</option>
							<option value="red">Red</option>
							<option value="property">Property</option>
							<option value="card">Card</option>
							<option value="start">Start</option>
						</select>
					</label>
				</div>

				<!-- Properties -->
				<div class="mt-4 rounded border bg-white p-4 shadow">
					<h2 class="mb-2 font-bold">Properties</h2>
					<div class="flex flex-col gap-2">
						{#each squareProperties as prop}
							<div class="rounded border p-2 text-sm">
								<div class="font-bold">{prop.name}</div>
								<div>Price: {prop.price}</div>
								<div>Profit: {prop.profitRate}%</div>
								<button class="mt-1 text-xs text-red-500" onclick={() => deleteProperty(prop.id)}
									>Delete</button
								>
							</div>
						{/each}
						<button
							class="mt-2 rounded bg-green-500 px-2 py-1 text-sm text-white"
							onclick={() => addProperty(selectedSquare.id)}
						>
							Add Property
						</button>
					</div>
				</div>
			{/if}
		{/if}
	</div>

	<!-- Canvas -->
	<div class="relative flex-1 overflow-hidden border bg-gray-50" id="map-container">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<svg class="h-full w-full" onclick={handleSvgClick}>
			<!-- Paths -->
			{#each paths as path (path.id)}
				{@const s1 = getSquare(path.square1Id)}
				{@const s2 = getSquare(path.square2Id)}
				{#if s1 && s2}
					<line x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} stroke="black" stroke-width="2" />
				{/if}
			{/each}

			<!-- Connection Line (Preview) -->
			{#if connectingSquareId}
				{@const s1 = getSquare(connectingSquareId)}
				{#if s1}
					<!-- We would need mouse pos for the other end, skipping for simplicity or adding later -->
				{/if}
			{/if}

			<!-- Squares -->
			{#each squares as square (square.id)}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<g
					transform="translate({square.x}, {square.y})"
					onmousedown={(e) => handleSquareMouseDown(e, square.id)}
					class="cursor-pointer"
				>
					<circle
						r="10"
						fill={square.type === 'blue'
							? 'blue'
							: square.type === 'red'
								? 'red'
								: square.type === 'property'
									? 'green'
									: 'gray'}
						stroke={selectedSquareId === square.id ? 'yellow' : 'white'}
						stroke-width="2"
					/>
					{#if square.name}
						<text y="-15" text-anchor="middle" class="pointer-events-none text-xs select-none"
							>{square.name}</text
						>
					{/if}
				</g>
			{/each}
		</svg>
	</div>
</div>
