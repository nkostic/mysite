<script>
	import '$lib/prism-theme.postcss';

	export let title;
	export let date;
	export let image;

	let dateDisplay = new Date(Date.parse(date)).toLocaleDateString({
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
</script>

<svelte:head>
	<title>{title} - Nenad Kostic</title>
</svelte:head>

<div class="prose prose-sm sm:prose page max-w-none sm:max-w-none">
	<div class="py-8 sm:py-10 sm:text-center">
		<div class="font-bold text-4xl mb-4">{title}</div>
		<div class="text-sm">{dateDisplay}</div>
	</div>
	{#if image}
		<img src={`/blog/${image}`} class="full-bleed" alt="Banner" />
	{/if}
	<slot />
</div>
