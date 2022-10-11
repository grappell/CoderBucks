<script>
  import { onMount } from "svelte";
  import authStore from "../store/authStore";

  let isLoggedIn = false;

  onMount(() => {
    isLoggedIn = $authStore.isLogedIn;
    console.log(isLoggedIn, $authStore.isLogedIn);
  });
</script>

{#if isLoggedIn}
  <slot />
{:else}
  <h2>You have to be logged in to view this page</h2>
  <p>You can log in <a href="/loginWithEmail">here</a></p>
{/if}
