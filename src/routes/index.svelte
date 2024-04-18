<script context="module">
	export const prerender = true;
	export async function load({ session }) {
		const posts = session.posts;
		return { props: { posts } };
	}
</script>

<script>
	export let posts;

  const formatDate = (value) => {
    if (isNaN(Date.parse(value))) {
        console.error('Invalid date:', value);
        return value;
    }

    const date = new Date(value);
    return new Intl.DateTimeFormat({
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    }).format(date);
  };
</script>

<svelte:head>
	<title>Nenad Kostic</title>
</svelte:head>

<div class="max-w-2xl mx-auto p-4 sm:p-8">
	<div
		class="flex flex-col sm:flex-row justify-between items-center mb-12 md:my-16 lg:my-24 lg:mb-32"
	>
		<div class="order-1 sm:order-0 text-sm sm:text-base">
			<div>
				<p class="mb-4">Welcome to my site.</p>
			</div>
			<div>
				<p class="mb-4">I am a senior software engineer based in Calgary</p>
			</div>
			<div>
				<p class="mb-4">
					Currently, I am embarking on an exciting new chapter in my career, collaborating with inspiring colleagues at <a class="underline font-bold text-lg" href="https://www.lumenalta.com/">Lumenalta</a>.
				</p>
			</div>
			<div>
				<p class="mb-4">
					For many years, I contributed as a Senior Front End Engineer at Worldplay, where I developed for a video platform named Vidflex. <a class="underline" href="https://www.worldplaynetworks.com/">Learn more about it here.</a>
				</p>
			</div>
			<div>
				<p class="mb-4">
					For a long time I engaged in a variety of intriguing projects with Frontech Solutions, enhancing my expertise across the stack from architecture solutions to implementation and team leading. <a class="underline" href="https://frontech.ca/">Explore.</a>
				</p>
			</div>
		</div>
		<div class="order-0 sm:order-1 mb-12 sm:mb-0 sm:ml-6 sm:flex-none text-center">
			<img alt="Profile bust" src="/nenadkostic-2023.jpeg" class="rounded-full w-48 h-48 bg-hardLime " />
		</div>
	</div>
	<div>
		{#each posts as post}
			<a
				href={`./blog/${post.slug}`}
				class="post block mb-4 pb-4 border-b border-gray-100 last:border-none last:mb-0"
			>
				<div class="title font-medium text-xl">{post.title}</div>
				<div class="date text-gray-400 font-light">{formatDate(post.date)}</div>
			</a>
		{/each}
	</div>
</div>
