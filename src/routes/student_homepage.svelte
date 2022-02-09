<script>
  import { getTeachers } from "../db";
  import authStore from "../store/authStore";
  import { onMount } from "svelte";
  import { Button } from "sveltestrap/src";
  import { goto } from "@sapper/app";
  import Box from "../components/box.svelte";

  // onMount(async () => {
  //   console.log($authStore.isStudent);
  //   if (!$authStore.isStudent) {
  //     alert("You are not a student");
  //     await goto("/");
  //   }
  // });
</script>

<div class="container">
  <div class="row">
    <div class="col">Column</div>
    <div class="col">Column</div>
    <div class="col">Column</div>
  </div>
</div>

<div class="row">
  <Box
    dimensions={{ x: 100, y: 10, roundnes: 10 }}
    color={{ r: 59, g: 59, b: 59 }}
    content={{ header: "Example A", subtext: "Subtext for example a" }}
    image={{
      src: "https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg",
      alt: "Cute dog (for testing)",
      size: 100,
    }}
  />
  <Box
    dimensions={{ x: 100, y: 10, roundnes: 10 }}
    color={{ r: 59, g: 59, b: 59 }}
    content={{ header: "Example B", subtext: "dkfsdkllj" }}
    image={{
      src: "https://i.guim.co.uk/img/media/fe1e34da640c5c56ed16f76ce6f994fa9343d09d/0_174_3408_2046/master/3408.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=67773a9d419786091c958b2ad08eae5e",
      alt: "Cute dog (for testing)",
      size: 100,
    }}
  />
</div>

<!-- Want to have: everything at a glance -->
<style>
  .container {
    padding: 20px;
  }
</style>
