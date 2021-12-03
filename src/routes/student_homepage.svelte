<script>
  import { getTeachers } from "../db";
  import authStore from "../store/authStore";
  import { onMount } from "svelte";
  import { Button } from "sveltestrap/src";

  onMount(async () => {
    console.log($authStore.studentPath);
  });
</script>
