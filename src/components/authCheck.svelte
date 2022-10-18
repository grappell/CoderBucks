<script>
  import { onMount } from "svelte";
  import authStore from "../store/authStore";

  let isLoggedIn = false;
  let isCorrectUser = false;

  export let teacherData = null;

  onMount(() => {
    isLoggedIn = JSON.parse(sessionStorage.getItem("authStore"));
    authStore.set(isLoggedIn);
    isLoggedIn = isLoggedIn?.isLogedIn ? isLoggedIn.isLogedIn : false;

    if (!isLoggedIn) {
      return;
    }

    console.log($authStore.userId);

    console.log(teacherData.userId);
    if ($authStore.userId === teacherData.userId) {
      isCorrectUser = true;
    }
  });
</script>

{#if isLoggedIn}
  {#if isCorrectUser}
    <slot />
  {:else}
    <p style="text-align: center;">
      Access Denied, please log in as the right user
    </p>
  {/if}
{:else}
  <h2>You have to be logged in to view this page</h2>
  <p>You can log in <a href="/loginWithEmail">here</a></p>
{/if}
