<script lang="ts">
  import { SiBluesky } from "@icons-pack/svelte-simple-icons";

  let { size = 16 }: { size?: number } = $props();
</script>

<span class="mark" title="Bluesky">
  <SiBluesky {size} color="currentColor" />
</span>

<style>
  .mark { display: inline-grid; place-items: center; color: #1185fe; line-height: 0; }
</style>
