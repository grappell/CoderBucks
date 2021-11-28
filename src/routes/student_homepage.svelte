<script>
  import { getTeachers } from "../db";
  import authStore from "../store/authStore";
  import { onMount } from "svelte";

  onMount(async () => {
    console.log($authStore.studentPath);
  });
</script>
