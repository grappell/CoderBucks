<script>
  import Nav from "../components/Nav.svelte";
  import { onMount } from "svelte";
  import authStore from "../store/authStore";
  import { Container } from "sveltestrap/src";

  export let segment;

  onMount(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        authStore.update((previous) => {
          return {
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

    if ($authStore.uid == undefined) {
      let sessionStorageIn = sessionStorage.getItem("authStore");
      if (sessionStorageIn) {
        authStore.set(JSON.parse(sessionStorageIn));
      }
    }
  });
</script>

<Nav {segment} />

<Container>
  <slot />
</Container>
