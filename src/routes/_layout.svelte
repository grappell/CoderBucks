<script>
  import Nav from "../components/Nav.svelte";
  import { onMount } from "svelte";
  import authStore from "../store/authStore";
  import { Container } from "sveltestrap/src";

  export let segment;

  onMount(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var uid = user.uid;
        authStore.update((previous) => {
          previous = {
            ...previous,
            userId: uid,
            fierbaseOn: true,
            isLogedIn: true,
          };
        });
      } else {
        authStore.set({
          userId: undefined,
          fierbaseOn: true,
          isLogedIn: false,
          isStudent: false,
          studentPath: undefined,
        });
      }
    });
  });
</script>

<Nav {segment} />

<Container>
  <slot />
</Container>
