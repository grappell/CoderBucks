<script>
  import { getTeachers } from "../db";
  import authStore from "../store/authStore";
  import { onMount } from "svelte";
  import { Button } from "sveltestrap/src";
  import { goto } from "@sapper/app";

  onMount(async () => {
    console.log($authStore.isStudent);
    if (!$authStore.isStudent) {
      await goto("/");
    }
  });
</script>

<!-- Want to have: everything at a glance -->
