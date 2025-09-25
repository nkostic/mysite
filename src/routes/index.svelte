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

		// Parse the date and treat it as local date to avoid timezone issues
		const dateParts = value.split('-');
		const year = parseInt(dateParts[0]);
		const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
		const day = parseInt(dateParts[2]);
		const date = new Date(year, month, day);
		
		return new Intl.DateTimeFormat('en-US', {
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
				<p class="mb-4">I am a senior software developer based in Calgary.</p>
			</div>
			<div>
				<p class="mb-4">
					Currently, I work as a staff developer at <br>
					<a
						class="underline font-bold text-lg"
						href="https://www.neofinancial.com/">Neo Financial</a
					>, building the future of Canadian banking with an amazing team of people!
				</p>
			</div>
			<div>
			<p class="mb-4">
				Previously, I was part of the amazing team at 
				<a class="underline font-bold text-md" href="https://www.lumenalta.com/">Lumenalta</a>, 
				where I had the chance to work alongside brilliant people in a fully remote organization with an inspiring culture.
			</p>
			</div>
			<div>
				<p class="mb-4">
					For many years, I contributed as a Senior Front End Engineer at Worldplay, where I
					developed for the video platform Vidflex.
				</p>
			</div>
			<div>
				<p class="mb-4">
					Earlier, I collaborated with <a class="underline" href="https://frontech.ca/"
						>Frontech Solutions</a
					> on a range of interesting projects, helping to design and build successful business platforms
					across the stack—from architecture to implementation and team leadership.
				</p>
			</div>
		</div>

		<div class="order-0 sm:order-1 mb-12 sm:mb-0 sm:ml-6 sm:flex-none text-center">
			<img
				alt="Profile bust"
				src="/nenadkostic-2023.jpeg"
				class="rounded-full w-48 h-48 bg-hardLime "
			/>
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
